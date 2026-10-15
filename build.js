// Genera las páginas de la web a partir de las carpetas reales.
// Uso: node build.js  (desde la carpeta web/)
const fs = require('fs');
const path = require('path');

const NOMBRE = 'Proyecto Don Pepe';
const TAGLINE = 'Propuesta de construcción y remodelación — Frente, Piscina, Minigolf y Motelera. Fotos del terreno, vídeos y propuestas visuales.';

const ZONAS = [
  { id: 'frente',   nombre: 'Frente de presentación', desc: 'La entrada del proyecto y punto de partida del recorrido: vista del acceso principal, la primera imagen que recibe al visitante.', soloFotos: true },
  { id: 'piscina',  nombre: 'Piscina',                desc: 'Zona de la piscina existente: estado actual, detalles a reparar y propuesta de acabado.' },
  { id: 'minigolf', nombre: 'Minigolf',               desc: 'Zona del minigolf, incluido el parate de atrás. Recorrido completo del área de juego y su potencial.' },
  { id: 'motelera', nombre: 'Motelera',               desc: 'Zona de la motelera: habitaciones y exteriores. Estado actual y propuestas de mejora.' },
];

const lista = (dir) => {
  const p = path.join(__dirname, dir);
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p).filter(f => !f.startsWith('.')).sort();
};

const btnGuardar = (src, etiqueta) =>
  `<a class="btn-guardar" href="${src}" download onclick="event.stopPropagation()" title="${etiqueta}">↓ Guardar</a>`;

const css = `
* { margin:0; padding:0; box-sizing:border-box; }
:root {
  --bg:#0b1220; --bg2:#0e1728; --panel:#131f33; --panel2:#182742;
  --border:#24354f; --text:#eef2f7; --muted:#8fa1b8;
  --accent:#3fb6c8; --gold:#e3b768; --grad:linear-gradient(120deg,#3fb6c8,#5f8ee0);
}
html { scroll-behavior:smooth; }
body { font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; background:var(--bg); color:var(--text); min-height:100vh; -webkit-font-smoothing:antialiased; }
body::before { content:''; position:fixed; inset:0; z-index:-1; background:radial-gradient(900px 400px at 80% -10%, rgba(63,182,200,.10), transparent 60%), radial-gradient(700px 380px at -10% 110%, rgba(227,183,104,.08), transparent 60%); }

/* barra superior */
.topbar { position:sticky; top:0; z-index:50; display:flex; align-items:center; gap:1.2em; padding:.85em 1.5em; background:rgba(11,18,32,.85); backdrop-filter:blur(14px); border-bottom:1px solid var(--border); }
.topbar .marca { font-weight:800; letter-spacing:.02em; font-size:.98rem; color:var(--text); text-decoration:none; display:flex; align-items:center; gap:.5em; }
.topbar .marca::before { content:''; width:.65em; height:.65em; border-radius:50%; background:var(--grad); box-shadow:0 0 12px rgba(63,182,200,.7); }
.topbar .volver { color:var(--muted); text-decoration:none; font-size:.83rem; padding:.35em .8em; border:1px solid var(--border); border-radius:999px; transition:.2s; }
.topbar .volver:hover { color:var(--text); border-color:var(--accent); }
.topbar .zona-actual { margin-left:auto; font-size:.8rem; color:var(--gold); padding:.3em .8em; border:1px solid rgba(227,183,104,.35); border-radius:999px; }

.wrap { max-width:1120px; margin:0 auto; padding:2.2em 1.5em 4.5em; }
h1 { font-size:1.9rem; font-weight:800; letter-spacing:-.01em; margin-bottom:.3em; }
.sub { color:var(--muted); font-size:.98rem; margin-bottom:2.2em; max-width:56ch; line-height:1.6; }
h2 { font-size:1.02rem; font-weight:700; margin:2.6em 0 1.1em; padding-bottom:.55em; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:.6em; }
h2::before { content:''; width:.4em; height:1.1em; border-radius:3px; background:var(--grad); }
h2 span { color:var(--muted); font-weight:500; font-size:.82rem; margin-left:auto; background:var(--panel); border:1px solid var(--border); padding:.15em .6em; border-radius:999px; }

/* hero portada */
.hero { position:relative; margin:-2.2em -1.5em 2.4em; height:min(52vh,420px); overflow:hidden; border-bottom:1px solid var(--border); }
.hero img { width:100%; height:100%; object-fit:cover; display:block; }
.hero::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(11,18,32,.25) 0%, rgba(11,18,32,.55) 55%, var(--bg) 100%); }
.hero .hero-txt { position:absolute; left:0; right:0; bottom:0; z-index:2; padding:0 1.5em 1.4em; max-width:1120px; margin:0 auto; }
.hero h1 { font-size:clamp(1.8rem,5vw,2.8rem); text-shadow:0 2px 24px rgba(0,0,0,.5); }
.hero .sub { margin:0; color:#cfd9e6; }

/* tarjetas de zona */
.carpetas { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:1.3em; }
.carpeta { display:block; text-decoration:none; color:var(--text); background:linear-gradient(180deg,var(--panel),var(--bg2)); border:1px solid var(--border); border-radius:14px; overflow:hidden; transition:transform .22s ease, border-color .22s, box-shadow .22s; box-shadow:0 6px 22px rgba(0,0,0,.35); }
.carpeta:hover { transform:translateY(-5px); border-color:var(--accent); box-shadow:0 14px 34px rgba(0,0,0,.5), 0 0 0 1px rgba(63,182,200,.25); }
.carpeta .mini { aspect-ratio:16/10; background:#000; overflow:hidden; }
.carpeta .mini img { width:100%; height:100%; object-fit:cover; transition:transform .4s ease; }
.carpeta:hover .mini img { transform:scale(1.06); }
.carpeta .info { padding:1em 1.1em 1.15em; }
.carpeta .info b { display:block; font-size:1rem; margin-bottom:.25em; }
.carpeta .info small { color:var(--muted); font-size:.82rem; }
.carpeta .info .flecha { float:right; color:var(--accent); font-weight:700; transition:transform .2s; }
.carpeta:hover .flecha { transform:translateX(3px); }

/* galería */
.galeria { display:grid; grid-template-columns:repeat(auto-fill,minmax(265px,1fr)); gap:.9em; }
.galeria figure { margin:0; border-radius:12px; overflow:hidden; cursor:zoom-in; background:#000; aspect-ratio:3/2; border:1px solid var(--border); }
.galeria img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .3s ease; }
.galeria figure:hover img { transform:scale(1.04); }

/* propuestas IA */
.ia-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(285px,1fr)); gap:1em; }
.ia-grid figure { margin:0; border-radius:12px; overflow:hidden; cursor:zoom-in; background:#000; aspect-ratio:3/2; position:relative; border:1px solid rgba(227,183,104,.35); box-shadow:0 6px 22px rgba(0,0,0,.35); }
.ia-grid img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .3s ease; }
.ia-grid figure:hover img { transform:scale(1.04); }
.ia-grid figure::before { content:'Propuesta'; position:absolute; top:.6em; left:.6em; z-index:3; font-size:.66rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#1a1206; background:var(--gold); padding:.25em .6em; border-radius:999px; }

/* vídeos */
.videos { display:grid; grid-template-columns:repeat(auto-fill,minmax(330px,1fr)); gap:1.1em; }
.videos video { width:100%; border-radius:12px; background:#000; border:1px solid var(--border); display:block; }
.video-box { margin:0; position:relative; }
.video-box .btn-guardar { position:absolute; top:.6em; right:.6em; bottom:auto; }

/* botón guardar */
.btn-guardar { position:absolute; right:.6em; bottom:.6em; z-index:3; display:inline-flex; align-items:center; gap:.35em; padding:.42em .8em; font-size:.74rem; font-weight:600; color:#fff; background:rgba(11,18,32,.68); border:1px solid rgba(255,255,255,.22); border-radius:999px; text-decoration:none; backdrop-filter:blur(6px); transition:.18s; }
.btn-guardar:hover { background:var(--accent); color:#04141a; border-color:var(--accent); }
.btn-guardar:active { transform:scale(.94); }
.galeria figure, .ia-grid figure, .portada-media { position:relative; }

/* lightbox */
.lightbox { display:none; position:fixed; inset:0; background:rgba(4,8,16,.96); z-index:100; align-items:center; justify-content:center; cursor:zoom-out; }
.lightbox.on { display:flex; }
.lightbox img { max-width:94vw; max-height:88vh; border-radius:10px; box-shadow:0 24px 80px rgba(0,0,0,.7); }
.lightbox-bar { position:fixed; left:0; right:0; bottom:0; z-index:101; display:none; justify-content:center; padding:1.1em; padding-bottom:calc(1.1em + env(safe-area-inset-bottom)); background:linear-gradient(transparent,rgba(4,8,16,.9)); pointer-events:none; }
.lightbox-bar.on { display:flex; }
.lightbox-bar .btn-guardar { position:static; pointer-events:auto; font-size:.92rem; padding:.65em 1.5em; background:var(--grad); color:#04141a; border:none; font-weight:700; }
.lightbox-bar .btn-guardar:hover { filter:brightness(1.1); }

/* ---- móvil ---- */
@media (max-width:640px){
  .wrap { padding:1.4em 1em 3.5em; }
  .topbar { padding:.75em 1em; }
  h1 { font-size:1.45rem; }
  .sub { font-size:.9rem; margin-bottom:1.5em; }
  h2 { margin:1.8em 0 .9em; }
  .hero { margin:-1.4em -1em 1.8em; height:38vh; }
  .hero .hero-txt { padding:0 1em 1.1em; }
  .carpetas { grid-template-columns:1fr; gap:1em; }
  .galeria { grid-template-columns:repeat(2,1fr); gap:.55em; }
  .ia-grid { grid-template-columns:repeat(2,1fr); gap:.55em; }
  .videos { grid-template-columns:1fr; gap:1em; }
  .galeria figure .btn-guardar, .ia-grid figure .btn-guardar { font-size:.66rem; padding:.3em .55em; }
  .carpeta:hover, .galeria figure:hover img { transform:none; }
  .carpeta:active, .galeria figure:active { opacity:.85; }
  .topbar .zona-actual { display:none; }
}
@media (max-width:340px){
  .galeria, .ia-grid { grid-template-columns:1fr; }
}
@media (hover:none){
  .carpeta:hover { transform:none; border-color:var(--border); box-shadow:0 6px 22px rgba(0,0,0,.35); }
  .carpeta:hover .mini img { transform:none; }
  .galeria figure:hover img, .ia-grid figure:hover img { transform:none; }
}
@supports (padding:env(safe-area-inset-bottom)){
  .wrap { padding-bottom:calc(3.5em + env(safe-area-inset-bottom)); }
}
@media (prefers-reduced-motion:reduce){
  * { transition:none !important; scroll-behavior:auto !important; }
}

/* contacto / footer */
.footer { border-top:1px solid var(--border); background:rgba(14,23,40,.7); margin-top:3em; }
.footer .wrap { padding-top:2em; padding-bottom:2em; }
.footer b { font-size:1rem; }
.footer p { color:var(--muted); font-size:.9rem; margin:.5em 0; max-width:60ch; line-height:1.6; }
.footer small { color:var(--muted); font-size:.75rem; opacity:.8; }
.nav-zonas { display:flex; gap:.8em; margin-top:3em; }
.nav-zonas a { flex:1; text-decoration:none; color:var(--text); background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:.9em 1em; font-size:.88rem; }
.nav-zonas a small { display:block; color:var(--muted); font-size:.75rem; margin-bottom:.2em; }
.nav-zonas a:hover { border-color:var(--accent); }
`;

const js = `
function abrirLb(el){var i=el.querySelector('img');if(!i)return;document.getElementById('lb-img').src=i.src;document.getElementById('lb-img').alt=i.alt||'';var a=document.getElementById('lb-guardar');a.href=i.src;a.setAttribute('download','');document.getElementById('lb').classList.add('on');document.getElementById('lb-bar').classList.add('on');document.body.style.overflow='hidden';}
function cerrarLb(){document.getElementById('lb').classList.remove('on');document.getElementById('lb-bar').classList.remove('on');document.body.style.overflow='';}
document.addEventListener('keydown',function(e){if(e.key==='Escape')cerrarLb();});
`;

const lightbox = '<div class="lightbox" id="lb" onclick="cerrarLb()"><img id="lb-img" src="" alt=""></div><div class="lightbox-bar" id="lb-bar"><a class="btn-guardar" id="lb-guardar" href="#" download onclick="event.stopPropagation()">Guardar imagen</a></div>';

const pagina = (title, desc, zonaActual, body) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏗️</text></svg>">
<style>${css}</style>
</head>
<body>
<div class="topbar">
  <a class="marca" href="index.html">${NOMBRE}</a>
  ${zonaActual ? `<a class="volver" href="index.html">← Volver</a><span class="zona-actual">${zonaActual}</span>` : '<span style="margin-left:auto"></span>'}
</div>
${body}
<footer class="footer"><div class="wrap"><b>${NOMBRE}</b><p>${TAGLINE}</p><small>Fotos y propuestas de carácter ilustrativo. Proyecto en fase de propuesta.</small></div></footer>
${lightbox}
<script>${js}</script>
</body>
</html>
`;

// ---- portada ----
const carpetasHtml = ZONAS.map(z => {
  const fotos = lista('images/' + z.id);
  const vids = lista('videos/' + z.id);
  const props = lista('images/ia/' + z.id);
  const partes = [fotos.length + ' fotos'];
  if (vids.length) partes.push(vids.length + ' vídeos');
  if (props.length && !z.soloFotos) partes.push(props.length + ' propuestas');
  const mini = fotos.length ? `<img src="images/${z.id}/${fotos[0]}" alt="${z.nombre}" loading="lazy">` : '';
  return `<a class="carpeta" href="${z.id}.html">
  <div class="mini">${mini}</div>
  <div class="info"><b>${z.nombre}<span class="flecha">→</span></b><small>${partes.join(' · ')}</small></div>
</a>`;
}).join('\n');

const hayPortada = fs.existsSync(path.join(__dirname, 'images/ia/portada.jpeg'));
const hero = hayPortada
  ? `<div class="hero"><img src="images/ia/portada.jpeg" alt="Propuesta visual del ${NOMBRE}"><div class="hero-txt"><h1>${NOMBRE}</h1><p class="sub">${TAGLINE}</p></div></div>`
  : `<h1>${NOMBRE}</h1><p class="sub">${TAGLINE}</p>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), pagina(NOMBRE + ' — Propuesta de construcción', TAGLINE, '', `
<div class="wrap">
  ${hero}
  <div class="carpetas">${carpetasHtml}</div>
</div>
`));

// ---- páginas de zona ----
for (let zi = 0; zi < ZONAS.length; zi++) {
  const z = ZONAS[zi];
  const ant = ZONAS[zi - 1];
  const sig = ZONAS[zi + 1];
  const fotos = lista('images/' + z.id);
  const vids = lista('videos/' + z.id);
  const props = lista('images/ia/' + z.id);

  const galeria = fotos.length
    ? `<div class="galeria">${fotos.map(f =>
        `<figure onclick="abrirLb(this)"><img src="images/${z.id}/${f}" alt="${z.nombre}" loading="lazy">${btnGuardar('images/' + z.id + '/' + f, 'Guardar foto')}</figure>`
      ).join('')}</div>`
    : '<p class="sub">Sin fotos.</p>';

  const videosHtml = vids.length
    ? `<h2>Vídeos<span>${vids.length}</span></h2><div class="videos">${vids.map(v =>
        `<figure class="video-box"><video controls preload="metadata" src="videos/${z.id}/${v}"></video>${btnGuardar('videos/' + z.id + '/' + v, 'Guardar vídeo')}</figure>`
      ).join('')}</div>`
    : '';

  const propsHtml = (props.length && !z.soloFotos)
    ? `<h2>Propuestas con IA<span>${props.length}</span></h2>
       <div class="ia-grid">${props.map(f =>
        `<figure onclick="abrirLb(this)"><img src="images/ia/${z.id}/${f}" alt="Propuesta ${z.nombre}" loading="lazy">${btnGuardar('images/ia/' + z.id + '/' + f, 'Guardar propuesta')}</figure>`
      ).join('')}</div>`
    : '';

  const navHtml = `<div class="nav-zonas">${ant ? `<a href="${ant.id}.html"><small>← Anterior</small>${ant.nombre}</a>` : '<a href="index.html"><small>←</small>Portada</a>'}${sig ? `<a href="${sig.id}.html" style="text-align:right"><small>Siguiente →</small>${sig.nombre}</a>` : `<a href="index.html" style="text-align:right"><small>→</small>Volver a portada</a>`}</div>`;

  fs.writeFileSync(path.join(__dirname, z.id + '.html'), pagina(z.nombre + ' — ' + NOMBRE, z.desc, z.nombre, `
<div class="wrap">
  <h1>${z.nombre}</h1>
  <p class="sub">${z.desc}</p>
  ${propsHtml}
  <h2>Fotos del terreno<span>${fotos.length}</span></h2>
  ${galeria}
  ${videosHtml}
  ${navHtml}
</div>
`));
}

console.log('Generadas: index.html + ' + ZONAS.map(z => z.id + '.html').join(', '));
