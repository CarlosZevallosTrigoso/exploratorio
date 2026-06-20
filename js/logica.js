// logica.js — Funciones puras del repositorio de ensayos.
// Sin dependencias y sin acceso al DOM, por lo que se pueden probar en Node.
// El código que toca el DOM vive en los <script type="module"> de cada página.

// Convierte un texto en un identificador apto para anclas de URL (#seccion).
export function slug(texto) {
  return String(texto)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')   // todo lo no alfanumérico -> guion
    .replace(/^-+|-+$/g, '')       // recorta guiones de los extremos
    || 'seccion';
}

// Dada una lista de textos, devuelve slugs únicos (añade -2, -3 a los repetidos).
export function slugsUnicos(textos) {
  const vistos = new Map();
  return textos.map((t) => {
    const base = slug(t);
    const n = (vistos.get(base) || 0) + 1;
    vistos.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  });
}

// Normaliza una entrada del manifest. Devuelve null si falta lo esencial
// (slug y titulo), de modo que una entrada rota no tumbe todo el índice.
export function normalizarEnsayo(e) {
  if (!e || typeof e !== 'object') return null;
  if (!e.slug || !e.titulo) return null;
  return {
    slug: String(e.slug),
    titulo: String(e.titulo),
    subtitulo: e.subtitulo ? String(e.subtitulo) : '',
    abstract: e.abstract ? String(e.abstract) : '',
    fecha: e.fecha ? String(e.fecha) : '',
    tema: e.tema ? String(e.tema) : 'Sin tema',
  };
}

// Limpia el manifest completo, descartando entradas inválidas.
export function limpiarManifest(lista) {
  if (!Array.isArray(lista)) return [];
  return lista.map(normalizarEnsayo).filter(Boolean);
}

// Orden descendente por fecha (ISO YYYY-MM-DD). Las sin fecha van al final,
// desempatando por título.
export function ordenarPorFechaDesc(ensayos) {
  return [...ensayos].sort((a, b) => {
    if (!a.fecha && !b.fecha) return a.titulo.localeCompare(b.titulo, 'es');
    if (!a.fecha) return 1;
    if (!b.fecha) return -1;
    return b.fecha.localeCompare(a.fecha);
  });
}

// Agrupa por año (descendente). Cada grupo: { anio, items } por fecha desc.
export function agruparPorAnio(ensayos) {
  const ordenados = ordenarPorFechaDesc(ensayos);
  const mapa = new Map();
  for (const e of ordenados) {
    const anio = /^\d{4}-\d{2}-\d{2}$/.test(e.fecha) ? e.fecha.slice(0, 4) : 'Sin fecha';
    if (!mapa.has(anio)) mapa.set(anio, []);
    mapa.get(anio).push(e);
  }
  const grupos = [...mapa.entries()].map(([anio, items]) => ({ anio, items }));
  grupos.sort((a, b) => {
    if (a.anio === 'Sin fecha') return 1;
    if (b.anio === 'Sin fecha') return -1;
    return b.anio.localeCompare(a.anio);
  });
  return grupos;
}

// Agrupa por tema (alfabético, locale es). Dentro de cada tema, por fecha desc.
export function agruparPorTema(ensayos) {
  const mapa = new Map();
  for (const e of ensayos) {
    if (!mapa.has(e.tema)) mapa.set(e.tema, []);
    mapa.get(e.tema).push(e);
  }
  const grupos = [...mapa.entries()].map(([tema, items]) => ({
    tema,
    items: ordenarPorFechaDesc(items),
  }));
  grupos.sort((a, b) => a.tema.localeCompare(b.tema, 'es'));
  return grupos;
}

// Formatea una fecha ISO (YYYY-MM-DD) como "14 de marzo de 2026".
// Si el formato no es el esperado, devuelve la cadena original sin romperse.
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function formatearFecha(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || '';
  const [a, m, d] = iso.split('-').map(Number);
  if (m < 1 || m > 12) return iso;
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

// Fecha en formato compacto dd.mm.aaaa, como en czt-bosque.
export function fechaNumerica(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || '';
  const [a, m, d] = iso.split('-');
  return `${d}.${m}.${a}`;
}

// Cuenta palabras de un texto Markdown, ignorando la sintaxis de formato.
export function contarPalabras(md) {
  let t = String(md);
  t = t.replace(/```[\s\S]*?```/g, ' ');        // bloques de código
  t = t.replace(/`[^`]*`/g, ' ');               // código en línea
  t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');   // imágenes
  t = t.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'); // enlaces -> solo el texto
  t = t.replace(/^#{1,6}\s+/gm, '');            // marcas de encabezado
  t = t.replace(/^\s*[-+*]\s+/gm, ' ');         // viñetas
  t = t.replace(/-{3,}/g, ' ');                 // separadores ---
  t = t.replace(/[*_>#~`]/g, ' ');              // símbolos de énfasis/cita
  return t.trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
}

// Minutos de lectura estimados (~200 palabras/min, mínimo 1).
export function tiempoLectura(palabras) {
  return Math.max(1, Math.round(palabras / 200));
}
