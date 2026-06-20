// ui.js — Mueblería compartida por el índice y el lector: los cuatro niveles
// de brillo de czt-bosque y el panel "opciones". Toca el DOM (no se prueba en
// Node). La fuente es siempre Lora: aquí no hay conmutador de tipografía.

export const TEMAS = [
  { bg: '#ffffff', fg: '#111111', fgSec: '#888888', fgTer: '#999999', fgMut: '#bbbbbb', border: '#eeeeee', link: '#1a54a5', hl: 'rgba(255,230,100,0.35)' },
  { bg: '#e8e8e8', fg: '#1a1a1a', fgSec: '#666666', fgTer: '#777777', fgMut: '#999999', border: '#d0d0d0', link: '#1a54a5', hl: 'rgba(255,230,100,0.35)' },
  { bg: '#3a3a3a', fg: '#e0e0e0', fgSec: '#aaaaaa', fgTer: '#999999', fgMut: '#777777', border: '#505050', link: '#e8d17a', hl: 'rgba(255,200,50,0.2)' },
  { bg: '#1e1e1e', fg: '#d8d8d8', fgSec: '#999999', fgTer: '#888888', fgMut: '#666666', border: '#3a3a3a', link: '#e8d17a', hl: 'rgba(255,200,50,0.15)' },
];

const CLAVE = 'brillo';

export function nivelGuardado() {
  try {
    const n = parseInt(localStorage.getItem(CLAVE), 10);
    return Number.isInteger(n) && n >= 0 && n < TEMAS.length ? n : 0;
  } catch { return 0; }
}

function guardarNivel(n) {
  try { localStorage.setItem(CLAVE, String(n)); } catch { /* sin persistencia */ }
}

export function aplicarTema(nivel) {
  const t = TEMAS[nivel] || TEMAS[0];
  const r = document.documentElement.style;
  r.setProperty('--bg', t.bg);
  r.setProperty('--fg', t.fg);
  r.setProperty('--fg-secondary', t.fgSec);
  r.setProperty('--fg-tertiary', t.fgTer);
  r.setProperty('--fg-muted', t.fgMut);
  r.setProperty('--border', t.border);
  r.setProperty('--link', t.link);
  r.setProperty('--highlight', t.hl);
}

// Conecta el botón "opciones" y los puntos de brillo. Espera en el DOM:
//   #opciones-toggle, #opciones-panel, y .brillo-dot[data-nivel] dentro del panel.
export function initOpciones() {
  const nivel = nivelGuardado();
  aplicarTema(nivel);

  const toggle = document.getElementById('opciones-toggle');
  const panel = document.getElementById('opciones-panel');
  const dots = [...document.querySelectorAll('.brillo-dot')];

  dots.forEach(d =>
    d.classList.toggle('active', parseInt(d.dataset.nivel, 10) === nivel));

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const abierto = panel.classList.toggle('open');
      toggle.textContent = abierto ? 'opciones ×' : 'opciones ›';
    });
  }

  dots.forEach(d => {
    d.addEventListener('click', () => {
      const n = parseInt(d.dataset.nivel, 10);
      aplicarTema(n);
      guardarNivel(n);
      dots.forEach(x => x.classList.toggle('active', x === d));
    });
  });
}
