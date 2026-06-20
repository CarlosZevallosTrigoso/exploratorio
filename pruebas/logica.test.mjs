// Pruebas de las funciones puras. Ejecutar:  node pruebas/logica.test.mjs
import assert from 'node:assert/strict';
import {
  slug, slugsUnicos, normalizarEnsayo, limpiarManifest,
  ordenarPorFechaDesc, agruparPorAnio, agruparPorTema, formatearFecha,
} from '../js/logica.js';

let n = 0;
const t = (nombre, fn) => { fn(); n++; };

// --- slug ---
t('slug quita acentos y normaliza', () =>
  assert.equal(slug('La organización  precede'), 'la-organizacion-precede'));
t('slug recorta guiones de los extremos', () =>
  assert.equal(slug('  ¿Qué es esto?  '), 'que-es-esto'));
t('slug vacío devuelve "seccion"', () =>
  assert.equal(slug('—'), 'seccion'));

// --- slugsUnicos ---
t('slugsUnicos desambigua repetidos', () =>
  assert.deepEqual(slugsUnicos(['Intro', 'Intro', 'Intro']),
                   ['intro', 'intro-2', 'intro-3']));
t('slugsUnicos respeta distintos', () =>
  assert.deepEqual(slugsUnicos(['Uno', 'Dos']), ['uno', 'dos']));

// --- normalizarEnsayo / limpiarManifest ---
t('normalizarEnsayo descarta sin slug o titulo', () => {
  assert.equal(normalizarEnsayo({ titulo: 'x' }), null);
  assert.equal(normalizarEnsayo({ slug: 'x' }), null);
  assert.equal(normalizarEnsayo(null), null);
});
t('normalizarEnsayo rellena tema por defecto', () =>
  assert.equal(normalizarEnsayo({ slug: 'a', titulo: 'A' }).tema, 'Sin tema'));
t('limpiarManifest filtra inválidos', () => {
  const r = limpiarManifest([
    { slug: 'a', titulo: 'A' },
    { titulo: 'sin slug' },
    'basura',
  ]);
  assert.equal(r.length, 1);
});
t('limpiarManifest tolera no-arreglo', () =>
  assert.deepEqual(limpiarManifest('nope'), []));

// --- ordenarPorFechaDesc ---
t('ordena por fecha descendente, sin fecha al final', () => {
  const r = ordenarPorFechaDesc([
    { slug: 'a', titulo: 'A', fecha: '2024-01-01', tema: 'T' },
    { slug: 'b', titulo: 'B', fecha: '2026-05-01', tema: 'T' },
    { slug: 'c', titulo: 'C', fecha: '', tema: 'T' },
  ]);
  assert.deepEqual(r.map(e => e.slug), ['b', 'a', 'c']);
});

// --- agruparPorAnio ---
t('agrupa por año descendente', () => {
  const g = agruparPorAnio([
    { slug: 'a', titulo: 'A', fecha: '2024-03-01', tema: 'T' },
    { slug: 'b', titulo: 'B', fecha: '2026-01-01', tema: 'T' },
    { slug: 'c', titulo: 'C', fecha: '2026-09-01', tema: 'T' },
  ]);
  assert.deepEqual(g.map(x => x.anio), ['2026', '2024']);
  assert.deepEqual(g[0].items.map(e => e.slug), ['c', 'b']); // dentro: fecha desc
});
t('"Sin fecha" queda al final', () => {
  const g = agruparPorAnio([
    { slug: 'a', titulo: 'A', fecha: '', tema: 'T' },
    { slug: 'b', titulo: 'B', fecha: '2026-01-01', tema: 'T' },
  ]);
  assert.equal(g[g.length - 1].anio, 'Sin fecha');
});

// --- agruparPorTema ---
t('agrupa por tema alfabético', () => {
  const g = agruparPorTema([
    { slug: 'a', titulo: 'A', fecha: '2026-01-01', tema: 'Estética' },
    { slug: 'b', titulo: 'B', fecha: '2026-02-01', tema: 'Fenomenología' },
    { slug: 'c', titulo: 'C', fecha: '2026-03-01', tema: 'Estética' },
  ]);
  assert.deepEqual(g.map(x => x.tema), ['Estética', 'Fenomenología']);
  assert.deepEqual(g[0].items.map(e => e.slug), ['c', 'a']); // dentro: fecha desc
});

// --- formatearFecha ---
t('formatea ISO a texto en español', () =>
  assert.equal(formatearFecha('2026-01-18'), '18 de enero de 2026'));
t('formatearFecha tolera formato inesperado', () => {
  assert.equal(formatearFecha('2026'), '2026');
  assert.equal(formatearFecha(''), '');
});

console.log(`\n  ${n}/${n} pruebas OK\n`);
