# Cómo se escribe un ensayo

Cada ensayo son **dos cosas**: un archivo Markdown en `ensayos/` y una entrada en `manifest.json`. Nada de HTML.

---

## 1. El archivo Markdown

- **Nombre del archivo = `slug`** del ensayo, con `.md`. Ej.: `2026-03-tiempo-vivido.md`.
  Usa solo minúsculas, números y guiones. Recomendado: empezar por año-mes para ordenar la carpeta.
- **No pongas el título con `#`**. El título, la fecha y el tema salen del `manifest.json`
  (así no hay dos sitios que mantener sincronizados). El `.md` empieza directamente con el texto.
- Estructura interna con encabezados, igual que Markdown normal:
  - `##` → sección (aparece en la tabla de contenido)
  - `###` → subsección (aparece indentada en la tabla de contenido)
  - `####` → un nivel más, en cursiva (no entra en la tabla de contenido)
- Lo demás funciona como Markdown estándar: `**negrita**`, `*cursiva*`, `> cita`,
  listas con `-`, enlaces `[texto](url)`, `---` para una separación, código con acentos graves.

### Plantilla para copiar

```markdown
Primer párrafo de entrada, sin encabezado. Plantea el problema del ensayo.

## Primera sección

Desarrollo.

### Una subsección

Más desarrollo.

> Una cita en bloque, si hace falta.

## Segunda sección

- punto uno
- punto dos

Cierre.
```

---

## 2. La entrada en `manifest.json`

Es una lista `[ ... ]` de objetos. Agrega uno nuevo (cuida las comas entre objetos):

```json
{
  "slug": "2026-03-tiempo-vivido",
  "titulo": "El tiempo vivido y la medida del reloj",
  "subtitulo": "Notas sobre la duración (campo opcional; quítalo si no aplica)",
  "abstract": "Treinta palabras, más o menos, que resuman la tesis. Es lo que se lee en el índice bajo el título.",
  "fecha": "2026-03-14",
  "tema": "Fenomenología",
  "palabras": 1234
}
```

- `slug`: idéntico al nombre del archivo `.md` (sin la extensión).
- `subtitulo`: **opcional**. Si está, se muestra en cursiva bajo el título del ensayo. Si no lo necesitas, omite la línea.
- `palabras`: **opcional**, el número que aparece en el índice. Lo calculo yo al generar la entrada; si lo omites, el índice simplemente no muestra el conteo (el lector siempre lo recalcula).
- `fecha`: formato `AAAA-MM-DD`. Es lo que usa el conmutador «por fecha».
- `tema`: el texto exacto agrupa el conmutador «Por tema». Reutiliza el mismo texto
  para que los ensayos caigan juntos (p. ej. siempre `"Estética"`, no a veces `"estetica"`).

---

## Para pedírmelo a mí

Basta con que me digas, por ejemplo:

> «Nuevo ensayo. Título: *…*. Tema: *…*. Fecha: *…*. Contenido: *…* (o pégame el borrador / las notas).»

Y devuelvo el `.md` ya formateado más la línea lista para el `manifest.json`.
