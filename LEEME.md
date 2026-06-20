# Repositorio de ensayos

Sitio estático: un índice y un lector de ensayos en Markdown. Sin build, sin
framework. Estética tomada de czt-bosque (mueblería sans, pequeña y callada),
con el contenido en Lora. Una sola dependencia externa: marked (CDN).

## Estructura

```
index.html              Índice, con conmutador por fecha / por tema
ensayo.html             Lector de un ensayo (?id=slug)
css/estilo.css          Todo el diseño (editar aquí cambia ambas páginas)
js/logica.js            Funciones puras (orden, agrupado, anclas, fechas, conteo)
js/ui.js                Mueblería compartida: brillo (4 niveles) y panel "opciones"
manifest.json           Metadatos de todos los ensayos
ensayos/                Un .md por ensayo
PLANTILLA-ENSAYO.md     Cómo escribir un ensayo nuevo
pruebas/                Pruebas Node de la lógica (no se publica)
package.json            Solo declara "type: module" para las pruebas
```

## Lo que se tomó de czt-bosque

- Barra superior `opciones ›` (izquierda) + navegación (derecha).
- Cuatro niveles de brillo (blanco → negro), con los puntos en "opciones".
  El brillo elegido se recuerda entre páginas (localStorage).
- Lista del índice compacta: fecha `dd.mm.aaaa` + título + (palabras).
- `meta` del ensayo con palabras y tiempo de lectura; barra de progreso.

Diferencias deliberadas: la fuente es siempre Lora (sin conmutador Sans/Serif);
cada ensayo es una página con URL propia y citable (no rutas `#/`); la zona
derecha del lector es la tabla de contenido, no el grafo de contexto.

## Publicar en GitHub Pages

1. Sube todo al repositorio.
2. Settings → Pages → Source: rama `main`, carpeta `/ (root)`.
3. Funciona tal cual porque GitHub Pages sirve por HTTP.

## Ver en tu máquina antes de publicar

No abras `index.html` con doble clic: el `fetch` se bloquea en `file://`.

```bash
cd <carpeta-del-proyecto>
python3 -m http.server 8000
```

Abre `http://localhost:8000`.

## Agregar un ensayo

Ver `PLANTILLA-ENSAYO.md`: un `.md` en `ensayos/` + una entrada en `manifest.json`.

## Probar la lógica

```bash
node pruebas/logica.test.mjs
```

## Qué está probado y qué no

- **Probado (Node, 21/21):** orden por fecha, agrupado por año y tema, anclas
  únicas, fechas, conteo de palabras y tiempo de lectura. El render de marked
  sobre el ensayo real (cursivas, «», URL) se verificó por separado.
- **Falta confirmar en navegador:** scroll-spy de la TOC, caja de navegación,
  cambio de brillo y barra de progreso. Código DOM estándar; ábrelo con el
  servidor local para verlo. Punto externo único: la URL del CDN de marked
  (`marked@18.0.5/lib/marked.umd.js`); si diera 404, se actualiza esa línea.
