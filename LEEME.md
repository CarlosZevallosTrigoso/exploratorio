# Repositorio de ensayos

Sitio estático: un índice y un lector de ensayos en Markdown. Sin build, sin framework.
Una sola dependencia externa (marked, por CDN, para convertir Markdown a HTML).

## Estructura

```
index.html              Índice, con conmutador Por fecha / Por tema
ensayo.html             Lector de un ensayo (?id=slug)
css/estilo.css          Todo el diseño (editar aquí cambia ambas páginas)
js/logica.js            Funciones puras (orden, agrupado, anclas, fechas)
manifest.json           Metadatos de todos los ensayos
ensayos/                Un .md por ensayo
PLANTILLA-ENSAYO.md     Cómo escribir un ensayo nuevo
pruebas/                Pruebas Node de la lógica (no se publica)
package.json            Solo declara "type: module" para las pruebas
```

## Publicar en GitHub Pages

1. Sube todo al repositorio.
2. Settings → Pages → Source: rama `main`, carpeta `/ (root)`.
3. Listo. La web funciona tal cual porque GitHub Pages sirve por HTTP.

## Ver en tu máquina antes de publicar

**No abras `index.html` con doble clic.** Las páginas usan `fetch()` para leer el
manifest y los `.md`, y el navegador lo bloquea en `file://`. Sírvelo por HTTP:

```bash
cd <carpeta-del-proyecto>
python3 -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Agregar un ensayo

Ver `PLANTILLA-ENSAYO.md`. En corto: un `.md` en `ensayos/` + una entrada en `manifest.json`.

## Probar la lógica

```bash
node pruebas/logica.test.mjs
```

## Qué está probado y qué no

- **Probado (Node):** ordenamiento por fecha, agrupado por año y por tema, generación
  de anclas únicas, formato de fechas. 15/15.
- **No probado aquí (requiere navegador real):** la carga por `fetch`, el render de
  marked, la tabla de contenido con scroll-spy y la caja de navegación. Son código
  estándar de DOM/IntersectionObserver, pero conviene confirmarlos abriendo el sitio
  en un navegador. El punto más expuesto es la URL del CDN de marked
  (`marked@18.0.5/lib/marked.umd.js`): si algún día devolviera 404, la página muestra
  un aviso y bastaría con actualizar esa línea de `ensayo.html`.
