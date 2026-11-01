/**
 * build.js — genera el sitio estático en /dist
 *   npm run build
 *
 * Las plantillas de abajo son las mismas de tu tema WordPress
 * (header.php, front-page.php, page-*.php, single-proyectos.php,
 * footer.php) pasadas a JavaScript. El contenido vive en src/data/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITIO } from './src/data/sitio.js';
import { PROYECTOS } from './src/data/proyectos.js';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(DIR, 'src');
const OUT = path.join(DIR, 'dist');
const VERSION = Date.now().toString(36);

/* ───────────── utilidades ───────────── */
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const exists = p => fs.existsSync(path.join(SRC, p));
const pad = n => String(n).padStart(2, '0');
const usedIcons = new Set(['x-lg', 'chevron-left', 'chevron-right', 'check-circle-fill']); // los que crea main.js

let R = ''; // prefijo relativo a la raíz para la página que se está generando

const I = name => { usedIcons.add(name); return `<i class="bi" aria-hidden="true"><svg><use href="${R}assets/icons.svg#${name}"/></svg></i>`; };

/* Imagen de src/uploads: usa la versión .webp si existe (la crea el script de imágenes) */
function asset(p) {
  if (!p) return '';
  if (/^https?:/.test(p)) return p;
  const webp = p.replace(/\.(png|jpe?g)$/i, '.webp');
  const useP = webp !== p && exists(webp) ? webp : p;
  return `${R}assets/${useP}`;
}
/* Fondo CSS con respaldo remoto mientras el cPanel siga vivo */
function bg(p) {
  const local = `url('${asset(p)}')`;
  return SITIO.respaldoImagenes && /^uploads\//.test(p) ? `${local}, url('${SITIO.respaldoImagenes}${p}')` : local;
}

const fotoPerfil = ['img/foto-perfil.webp', 'img/foto-perfil.jpg', 'img/foto-perfil.png'].find(exists);
const moodboard = ['img/moodboard.webp', 'img/moodboard.jpg', 'img/moodboard.png'].find(exists);
const cv = exists('cv/cv-yojhan-furuya.pdf') ? 'cv/cv-yojhan-furuya.pdf' : null;

const GRUPO = {
  universidad: { badge: 'Trabajo de la U', categoria: 'Trabajo académico', icono: 'mortarboard-fill' },
  propio: { badge: 'Proyecto propio', categoria: 'Proyecto personal', icono: 'rocket-takeoff-fill' },
  experimento: { badge: 'Experimento', categoria: 'Laboratorio creativo', icono: 'cpu-fill' }
};
const url = slug => `${R}proyectos/${slug}/`;

/* ───────────── migas de pan ───────────── */
function breadcrumbs(items, extra = '') {
  const abs = u => (SITIO.url ? SITIO.url.replace(/\/$/, '') + '/' + u : undefined);
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, ...(it.href !== undefined && abs(it.href) ? { item: abs(it.href) } : {}) })) };
  const parts = items.map((it, i) => {
    const last = i === items.length - 1;
    if (!last && it.href !== undefined) return `<a href="${R}${it.href}">${it.icono ? I(it.icono) + ' ' : ''}${esc(it.label)}</a><span class="breadcrumb-sep" aria-hidden="true">/</span>`;
    return `<span class="breadcrumb-current" aria-current="page">${esc(it.label)}</span>`;
  }).join('');
  return `<script type="application/ld+json">${JSON.stringify(ld)}</script><nav class="breadcrumb-row${extra ? ' ' + extra : ''}" aria-label="Migas de pan">${parts}</nav>`;
}
const INICIO = { label: 'Inicio', href: '', icono: 'house-door-fill' };

/* ───────────── layout (header.php + footer.php) ───────────── */
function layout({ title, description, active, body, mainClass = '', image, jsonld }) {
  const canonical = SITIO.url ? `${SITIO.url.replace(/\/$/, '')}/${currentPath}` : '';
  const ogImage = image ? (SITIO.url ? `${SITIO.url.replace(/\/$/, '')}/${asset(image).replace(R, '')}` : '') : '';
  const navIdx = { inicio: 0, 'sobre-mi': 1, proyectos: 2 }[active] ?? -1;
  const navBtn = (i, href, label) => `<a href="${R}${href}" class="nav-btn${navIdx === i ? ' active' : ''}"${navIdx === i ? ' aria-current="page"' : ''}>${label}</a>`;
  const menuLink = (i, href, icono, label) => `<a href="${R}${href}" class="menu-link-card${navIdx === i ? ' active' : ''}"${navIdx === i ? ' aria-current="page"' : ''}>${I(icono)} <span>${label}</span></a>`;
  const cvBtn = (cls, label, icono) => cv ? `<a href="${R}assets/${cv}" download class="${cls}">${icono ? I(icono) + ' ' : ''}${label}</a>` : '';

  return `<!doctype html>
<html lang="es" data-root="${R}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#08090d">
<meta name="author" content="${esc(SITIO.nombre)}">
${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
<meta property="og:type" content="website">
<meta property="og:locale" content="es_CL">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${canonical ? `<meta property="og:url" content="${canonical}">` : ''}
${ogImage ? `<meta property="og:image" content="${ogImage}"><meta name="twitter:card" content="summary_large_image">` : ''}
<link rel="icon" href="${R}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap">
<link rel="stylesheet" href="${R}assets/css/main.css?v=${VERSION}">
<script>
/* Antes de pintar: activa animaciones, recuerda la posición del cursor
   entre páginas y, si falta una imagen local, la toma del sitio antiguo. */
(function(d,w){
  d.documentElement.classList.add('js');
  try{ w.__pmCursorInit = w.__pmCursorLast = JSON.parse(sessionStorage.getItem('pmCursorPos')||'null'); }catch(e){}
  w.addEventListener('mousemove',function(e){ w.__pmCursorLast={x:e.clientX,y:e.clientY}; try{sessionStorage.setItem('pmCursorPos',JSON.stringify(w.__pmCursorLast));}catch(_){} },{passive:true});
  var REMOTO=${JSON.stringify(SITIO.respaldoImagenes || '')};
  if(REMOTO) w.addEventListener('error',function(e){
    var t=e.target; if(!t||!/^(IMG|SOURCE|VIDEO)$/.test(t.tagName)) return;
    var s=t.getAttribute('src')||''; var m=s.match(/assets\\/(uploads\\/.*)$/);
    if(m){ t.setAttribute('src', REMOTO+m[1]); if(t.tagName==='SOURCE'&&t.parentNode.load) t.parentNode.load(); }
  },true);
})(document,window);
</script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<div id="cursor-blob" aria-hidden="true"><svg viewBox="0 0 100 100"><path class="blob-path" d="M50,20 C65,15 80,30 82,50 C84,70 70,85 50,83 C30,81 16,68 18,50 C20,32 35,25 50,20Z"/></svg></div>
<script>(function(){var p=window.__pmCursorInit,el=document.getElementById('cursor-blob');if(p&&el){el.style.left=p.x+'px';el.style.top=p.y+'px';el.style.opacity='1';}})();</script>

<input type="checkbox" id="menu-toggle" aria-hidden="true" tabindex="-1">
<div class="mobile-topbar">
  <a href="${R}" class="mobile-topbar-brand"><span class="brand-mark">YF</span> Yojhan Furuya</a>
  <label for="menu-toggle" class="toggle-hamburguesa" role="button" tabindex="0" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="menu-lateral"><span></span><span></span><span></span></label>
</div>
<label for="menu-toggle" class="menu-overlay" aria-hidden="true"></label>
<nav class="menu-lateral" id="menu-lateral" aria-label="Menú móvil" aria-hidden="true">
  <div class="menu-lateral-header">
    <span class="menu-lateral-brand"><span class="brand-mark">YF</span> Yojhan Furuya</span>
    <label for="menu-toggle" class="menu-lateral-close" role="button" tabindex="0" aria-label="Cerrar menú">${I('x-lg')}</label>
  </div>
  <div class="menu-lateral-links">
    ${menuLink(0, '', 'house-door-fill', 'Inicio')}
    ${menuLink(1, 'sobre-mi/', 'person-fill', 'Sobre mí')}
    ${menuLink(2, 'proyectos/', 'grid-1x2-fill', 'Proyectos')}
    ${menuLink(3, '#contacto', 'chat-dots-fill', 'Contacto').replace(`href="${R}#contacto"`, `href="${active === 'inicio' ? '' : R}#contacto"`)}
  </div>
  <div class="menu-lateral-footer"><a href="mailto:${SITIO.email}" class="menu-lateral-mail">${I('envelope-fill')} ${SITIO.email}</a></div>
</nav>

<header class="nav-container" id="nav">
  <a href="${R}" class="nav-brand"><span class="brand-mark">YF</span> <span class="nav-brand-name">Yojhan Furuya</span></a>
  <nav class="nav-btns" aria-label="Navegación principal" data-page="${active}">
    <div class="blob" id="blob"></div>
    ${navBtn(0, '', 'Inicio')}
    ${navBtn(1, 'sobre-mi/', 'Sobre mí')}
    ${navBtn(2, 'proyectos/', 'Proyectos')}
    <a href="${active === 'inicio' ? '' : R}#contacto" class="nav-btn">Contacto</a>
  </nav>
  <label for="contact-float-toggle" class="nav-disponible" role="button" tabindex="0" aria-expanded="false" aria-controls="contact-panel"><span class="nav-disponible-dot"></span> Hablemos</label>
</header>

<main id="contenido" class="${mainClass}">
${body}
</main>

<footer class="site-footer">
  <div class="container-custom">
    <div class="footer-top">
      <div class="footer-col footer-col-brand">
        <a href="${R}" class="footer-logo"><span class="brand-mark">YF</span> Yojhan Furuya</a>
        <p class="footer-tagline">Desarrollador Front-End enfocado en interfaces modernas, experiencias digitales cuidadas y detalles que marcan la diferencia.</p>
        <span class="footer-badge"><span class="footer-badge-dot" aria-hidden="true"></span> Disponible para proyectos</span>
      </div>
      <nav class="footer-col" aria-label="Navegación del pie de página">
        <h2 class="footer-heading">Navegación</h2>
        <ul class="footer-nav">
          <li><a href="${R}">Inicio</a></li>
          <li><a href="${R}sobre-mi/">Sobre mí</a></li>
          <li><a href="${R}proyectos/">Proyectos</a></li>
          <li><a href="${R}experimentos/">Experimentos</a></li>
          <li><a href="${active === 'inicio' ? '' : R}#contacto">Contacto</a></li>
        </ul>
      </nav>
      <div class="footer-col">
        <h2 class="footer-heading">Contacto</h2>
        <ul class="footer-nav footer-contact">
          <li><a href="mailto:${SITIO.email}">${I('envelope-fill')} ${SITIO.email}</a></li>
          <li><a href="${SITIO.linkedin}" target="_blank" rel="noopener">${I('linkedin')} LinkedIn</a></li>
          <li><a href="${SITIO.github}" target="_blank" rel="noopener">${I('github')} GitHub</a></li>
          <li><a href="${SITIO.instagram}" target="_blank" rel="noopener">${I('instagram')} Instagram</a></li>
        </ul>
      </div>
      <div class="footer-col footer-col-cta">
        <h2 class="footer-heading">¿Tienes un proyecto?</h2>
        <p>Hablemos de cómo puedo ayudarte a construirlo.</p>
        <a href="mailto:${SITIO.email}" class="footer-cta-btn">Escribirme ${I('arrow-up-right')}</a>
        ${cvBtn('footer-cv-link', 'Descargar CV', 'file-earmark-arrow-down')}
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-copy">&copy; ${new Date().getFullYear()} Yojhan Furuya &middot; Todos los derechos reservados.</span>
      <span class="footer-made">Diseñado y desarrollado por mí ${I('heart-fill')}</span>
      <button class="footer-top-btn" type="button" aria-label="Volver arriba">Arriba ${I('arrow-up')}</button>
    </div>
  </div>
</footer>

<input type="checkbox" id="contact-float-toggle" aria-hidden="true" tabindex="-1">
<label for="contact-float-toggle" class="contact-float-trigger" role="button" tabindex="0" aria-label="Abrir panel de contacto" aria-expanded="false" aria-controls="contact-panel">${I('send-fill')}</label>
<div class="contact-float-curva"></div>
<aside class="contact-float-panel" id="contact-panel" aria-label="Panel de contacto" aria-hidden="true">
  <div class="contact-float-content">
    <label for="contact-float-toggle" class="contact-float-close" role="button" tabindex="0" aria-label="Cerrar panel">${I('x-lg')}</label>
    <span class="contact-float-badge">${I('stars')} Disponible para proyectos</span>
    <h2 class="contact-float-title">Yojhan Furuya</h2>
    <p class="contact-float-role">Desarrollador &amp; Diseñador Web</p>
    <p class="contact-float-text">Disponible para trabajo, proyectos, colaboraciones y freelance.</p>
    <div class="contact-float-links">
      <a href="mailto:${SITIO.email}">${I('envelope-fill')} ${SITIO.email}</a>
      <a href="${SITIO.linkedin}" target="_blank" rel="noopener">${I('linkedin')} LinkedIn</a>
      <a href="${SITIO.github}" target="_blank" rel="noopener">${I('github')} GitHub</a>
    </div>
    <div class="contact-float-actions">
      <a href="mailto:${SITIO.email}" class="contact-float-btn-primary">Escribirme ${I('arrow-up-right')}</a>
      ${cvBtn('contact-float-btn-secondary', 'CV', 'download')}
    </div>
  </div>
</aside>

<script src="${R}assets/js/main.js?v=${VERSION}" defer></script>
</body>
</html>`;
}

/* ───────────── componentes compartidos ───────────── */
function projectCard(p, delay = 0, { kicker = true, descKey = 'desc' } = {}) {
  const g = GRUPO[p.grupo];
  return `<article class="project-card position-relative" data-aos="fade-up"${delay ? ` data-aos-delay="${delay}"` : ''}>
  <div class="project-image">
    <img src="${asset(p.portada)}" alt="Portada del proyecto ${esc(p.titulo)}" loading="lazy" decoding="async" width="1200" height="800">
    <span class="project-badge">${I(g.icono)} ${g.badge}</span>
    <span class="project-open">${I('arrow-up-right')}</span>
  </div>
  <div class="project-body">
    ${kicker && p.kicker ? `<div class="project-kicker">${esc(p.kicker)}</div>` : ''}
    <h3>${esc(p.titulo)}</h3>
    <p>${esc(p[descKey] || p.desc)}</p>
    <div class="tags">${p.tags.slice(0, descKey === 'descCorta' ? 3 : 8).map(t => `<span>${esc(t)}</span>`).join('')}</div>
    <a href="${url(p.slug)}" class="stretched-link" aria-label="Ver proyecto ${esc(p.titulo)}"></a>
  </div>
</article>`;
}

function contactPanel({ title, text, primary = 'magnetic-btn', secondary }) {
  return `<section class="section" id="contacto">
  <div class="container-custom">
    <div class="contact-panel" data-aos="zoom-in">
      <span class="eyebrow">Contacto</span>
      <h2 class="section-title">${title}</h2>
      <p class="section-text">${text}</p>
      <div class="contact-actions">
        <a href="mailto:${SITIO.email}" class="${primary}">Escribirme ${I('send-fill')}</a>
        ${secondary || ''}
      </div>
    </div>
  </div>
</section>`;
}

function gallery(p, { badge = true, cls = '' } = {}) {
  const g = GRUPO[p.grupo];
  const imgs = p.galeria.length ? p.galeria : [p.portada];
  const multi = imgs.length > 1;
  return `<div class="gallery-wrap${cls ? ' ' + cls : ''}">
  <div class="gallery-main">
    <img src="${asset(imgs[0])}" alt="${esc(p.titulo)}" width="1600" height="1000" decoding="async">
    ${badge ? `<span class="gallery-badge">${I(g.icono)} ${g.badge}</span>` : ''}
    <button class="gallery-expand" type="button" aria-label="Ver en pantalla completa">${I('arrows-fullscreen')}</button>
    ${multi ? `<span class="gallery-counter" aria-live="polite">1 / ${imgs.length}</span>
    <button class="gallery-arrow prev" type="button" aria-label="Imagen anterior">${I('chevron-left')}</button>
    <button class="gallery-arrow next" type="button" aria-label="Imagen siguiente">${I('chevron-right')}</button>` : ''}
  </div>
  ${multi ? `<div class="gallery-thumbs">${imgs.map((src, i) => `<button type="button"${i === 0 ? ' class="active"' : ''} data-src="${asset(src)}" aria-label="Ver imagen ${i + 1}"><img src="${asset(src)}" alt="" loading="lazy" decoding="async"></button>`).join('')}</div>` : ''}
</div>`;
}

const statNum = n => {
  const m = String(n).match(/^(\d+)(.*)$/);
  return m ? `<strong data-count="${m[1]}" data-suffix="${esc(m[2])}">${esc(n)}</strong>` : `<strong>${esc(n)}</strong>`;
};
const statsStrip = (p, aos = 'data-aos="fade-up" data-aos-delay="120"') => p.stats.length ? `<div class="stats-strip" ${aos}>${p.stats.map(([n, t]) => `<div class="stat-card">${statNum(n)}<span>${esc(t)}</span></div>`).join('')}</div>` : '';

/* Secciones de detalle — mismas en proyecto individual y en experimentos */
function detailSections(p, ctx) {
  const isExp = ctx === 'exp';
  let s = '';
  if (p.problema || p.solucion || p.resultado.length || p.demuestra.length) s += `
<section class="section">
  <div class="container-custom">
    <span class="eyebrow" data-aos="fade-up">${isExp ? 'Contexto del experimento' : 'Contexto del proyecto'}</span>
    <h2 class="section-title section-title--space-lg" data-aos="fade-up">Problema, solución y resultado.</h2>
    <div class="detail-grid">
      ${p.problema ? `<div class="detail-block purple" data-aos="fade-up"><div class="block-icon">${I('exclamation-circle-fill')}</div><h3>El problema</h3><p>${esc(p.problema)}</p></div>` : ''}
      ${p.solucion ? `<div class="detail-block lime" data-aos="fade-up" data-aos-delay="60"><div class="block-icon">${I('lightbulb-fill')}</div><h3>La solución</h3><p>${esc(p.solucion)}</p></div>` : ''}
      ${p.resultado.length ? `<div class="detail-block" data-aos="fade-up"><div class="block-icon">${I('graph-up-arrow')}</div><h3>El resultado</h3><ul>${p.resultado.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>` : ''}
      ${p.demuestra.length ? `<div class="detail-block teal" data-aos="fade-up" data-aos-delay="60"><div class="block-icon">${I('trophy-fill')}</div><h3>Qué demuestra</h3><ul>${p.demuestra.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>` : ''}
    </div>
  </div>
</section>`;
  if (p.features.length) s += `
<section class="section section--no-top">
  <div class="container-custom">
    <span class="eyebrow" data-aos="fade-up">Funcionalidades</span>
    <h2 class="section-title section-title--space-lg" data-aos="fade-up">${isExp ? 'Qué hace.' : 'Qué hace cada módulo.'}</h2>
    <div class="feature-list" data-aos="fade-up">
      ${p.features.map(([t, d, b], i) => `<div class="feature-item"><div class="feature-num">${pad(i + 1)}</div><div class="feature-copy"><h4>${esc(t)}</h4>${d ? `<p>${esc(d)}</p>` : ''}</div>${b ? `<span class="feature-badge badge-lime">${esc(b)}</span>` : ''}</div>`).join('\n      ')}
    </div>
  </div>
</section>`;
  if (p.video) s += `
<section class="section section--no-top">
  <div class="container-custom">
    <span class="eyebrow" data-aos="fade-up">Demo en video</span>
    <h2 class="section-title section-title--space-md" data-aos="fade-up">${isExp ? 'En acción.' : 'El sistema en acción.'}</h2>
    <div class="video-wrap" data-aos="zoom-in">
      <video class="project-video" controls controlslist="nodownload" playsinline preload="none" poster="${asset(p.portada)}"><source src="${asset(p.video)}" type="video/mp4"></video>
      <div class="video-overlay" role="button" tabindex="0" aria-label="Reproducir demo"><div class="play-btn">${I('play-fill')}</div><p>Ver demo del sistema</p></div>
    </div>
  </div>
</section>`;
  if (p.timeline.length || p.tech.length) s += `
<section class="section">
  <div class="container-custom">
    <div class="timeline-layout">
      ${p.timeline.length ? `<div>
        <span class="eyebrow" data-aos="fade-up">Metodología</span>
        <h2 class="section-title section-title--space-lg" data-aos="fade-up">Cómo se construyó.</h2>
        <div class="timeline timeline--blob" data-aos="fade-up">
          ${p.timeline.map(([t, d], i) => `<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-step">Fase ${pad(i + 1)}</div><h4>${esc(t)}</h4>${d ? `<p>${esc(d)}</p>` : ''}</div>`).join('\n          ')}
        </div>
      </div>` : ''}
      ${p.tech.length ? `<div data-aos="fade-left" data-aos-delay="100">
        <span class="eyebrow">Stack técnico</span>
        <h2 class="section-title section-title--space-md">Tecnologías usadas.</h2>
        <div class="tech-grid">${p.tech.map(([n, d]) => `<div class="tech-card"><span>${esc(n)}</span>${d ? `<small>${esc(d)}</small>` : ''}</div>`).join('')}</div>
      </div>` : ''}
    </div>
  </div>
</section>`;
  if (p.futuro.length) s += `
<section class="section section--no-top">
  <div class="container-custom">
    <span class="eyebrow" data-aos="fade-up">Próximos pasos</span>
    <h2 class="section-title section-title--space-md" data-aos="fade-up">${isExp ? 'Ideas para seguir probando.' : 'Mejoras futuras planeadas.'}</h2>
    <div class="future-grid">
      ${p.futuro.map(([ic, t, d], i) => `<div class="future-card" data-aos="fade-up"${i % 3 ? ` data-aos-delay="${(i % 3) * 60}"` : ''}>${I(ic || 'stars')}<h4>${esc(t)}</h4>${d ? `<p>${esc(d)}</p>` : ''}</div>`).join('\n      ')}
    </div>
  </div>
</section>`;
  return s;
}

/* ═════════════════════ PÁGINAS ═════════════════════ */
let currentPath = '';
const pages = [];
function addPage(rel, depth, render) { pages.push({ rel, depth, render }); }

/* ── INICIO (front-page.php) ── */
addPage('index.html', 0, () => {
  const destacados = PROYECTOS.filter(p => p.destacado).sort((a, b) => a.destacado - b.destacado);
  return layout({
    title: 'Yojhan Furuya — Desarrollador Front-End y diseñador web',
    description: SITIO.descripcion,
    active: 'inicio',
    image: destacados[0]?.portada,
    jsonld: { '@context': 'https://schema.org', '@type': 'Person', name: SITIO.nombre, jobTitle: SITIO.rol, email: `mailto:${SITIO.email}`, address: { '@type': 'PostalAddress', addressLocality: 'Viña del Mar', addressCountry: 'CL' }, alumniOf: 'Duoc UC', sameAs: [SITIO.linkedin, SITIO.github, SITIO.instagram], ...(SITIO.url ? { url: SITIO.url } : {}) },
    body: `
<header id="inicio" class="hero">
  <div class="container-custom">
    <div class="hero-shell">
      <section class="hero-main" data-aos="fade-up">
        <div class="hero-inner">
          <div>
            <div class="hero-label">${I('stars')} Diseño &amp; Desarrollo Front-End</div>
            <h1 class="hero-title">Diseño y desarrollo para una mejor <span class="outline">experiencia</span> digital.</h1>
            <p class="hero-description">Soy desarrollador web front-end en Viña del Mar. Diseño interfaces centradas en el usuario y las llevo a código: sitios, ecommerce y sistemas que negocios reales usan todos los días.</p>
            <div class="hero-actions">
              <a href="#explora" class="magnetic-btn">Explorar proyectos ${I('arrow-up-right')}</a>
              <a href="#sobre-mi" class="ghost-btn">Enfoque ${I('chevron-down')}</a>
            </div>
          </div>
          <div class="hero-bottom">
            <div class="metric-card"><strong>UI / UX</strong><span>Interfaces modernas con jerarquía visual clara.</span></div>
            <div class="metric-card"><strong>Desarrollo</strong><span>HTML, CSS, JS, PHP, MySQL y WordPress.</span></div>
            <div class="metric-card"><strong>Laboratorio</strong><span>Experimentos de interacción y nuevas ideas.</span></div>
          </div>
        </div>
      </section>
      <aside class="hero-side">
        <article class="moodboard-card" data-aos="fade-left" data-aos-delay="120">
          <div class="moodboard-placeholder">
            ${moodboard ? `<img class="moodboard-photo" src="${R}assets/${moodboard}" alt="Moodboard visual: identidad y estilo del portafolio" width="1200" height="900" fetchpriority="high"><div class="moodboard-shade" aria-hidden="true"></div>`
              : `<div class="moodboard-grid" aria-hidden="true"><div class="mb-lime"></div><div class="mb-dark"></div><div class="mb-cyan"></div><div class="mb-dark mb-text"><span>UI</span></div><div class="mb-purple"></div><div class="mb-dark mb-text"><span>UX</span></div></div>`}
            <div class="moodboard-label">${I('grid-3x3-gap-fill')} Identidad visual · Estilo</div>
          </div>
        </article>
        <div class="hero-connect" data-aos="fade-left" data-aos-delay="220">
          <span class="hero-connect-title">${I('link-45deg')} Conecta conmigo</span>
          <div class="hero-social">
            <a href="mailto:${SITIO.email}" class="social-pill" style="--c:#ea4335">${I('envelope-fill')}<span class="social-pill-label">${SITIO.email}</span></a>
            <a href="${SITIO.linkedin}" target="_blank" rel="noopener" class="social-pill" style="--c:#2f8be6">${I('linkedin')}<span class="social-pill-label">LinkedIn</span></a>
            <a href="${SITIO.github}" target="_blank" rel="noopener" class="social-pill" style="--c:#f0f6fc">${I('github')}<span class="social-pill-label">GitHub</span></a>
            <a href="${SITIO.instagram}" target="_blank" rel="noopener" class="social-pill" style="--c:#e1306c">${I('instagram')}<span class="social-pill-label">${SITIO.instagramUser}</span></a>
          </div>
          <div class="tech-tags"><span>HTML5</span><span>CSS3</span><span>JavaScript</span><span>PHP</span><span>MySQL</span><span>WordPress</span><span>Shopify</span><span>Git</span></div>
        </div>
      </aside>
    </div>
  </div>
</header>

<section id="sobre-mi" class="section">
  <div class="container-custom">
    <a href="${R}sobre-mi/" class="sobre-mi-card" data-aos="fade-up">
      <div class="sobre-mi-blob blob-1"></div><div class="sobre-mi-blob blob-2"></div><div class="sobre-mi-blob blob-3"></div>
      <div class="sobre-mi-content">
        <span class="eyebrow">Sobre mí</span>
        <h2>Frontend visual<br>para marcas y <span class="accent">experiencias.</span></h2>
        <p>Desarrollador y diseñador web enfocado en UX, sistemas y experiencias digitales que se sienten bien de usar. Conoce mi historia, mi enfoque y cómo trabajo.</p>
        <span class="sobre-mi-btn">Ver más sobre mí ${I('arrow-up-right')}</span>
      </div>
      <div class="sobre-mi-stats">
        <div class="sobre-mi-stat"><strong>${PROYECTOS.length}</strong><span>Proyectos documentados</span></div>
        <div class="sobre-mi-stat"><strong>2+</strong><span>Años desarrollando</span></div>
        <div class="sobre-mi-stat"><strong>360 h</strong><span>Práctica profesional</span></div>
      </div>
    </a>
  </div>
</section>

<section id="explora" class="section">
  <div class="container-custom">
    <div class="projects-head">
      <div><span class="eyebrow">Explora mi trabajo</span><h2 class="section-title" data-aos="fade-up">Todo está acá, ordenado.</h2></div>
      <p class="section-copy" data-aos="fade-up" data-aos-delay="100">Trabajos de la universidad, proyectos propios y experimentos del laboratorio creativo. Cada uno con su propia historia.</p>
    </div>
    <div class="explora-grid">
      <a href="${R}proyectos/#formacion" class="explora-card" data-aos="fade-up">
        <div class="explora-icon">${I('mortarboard-fill')}</div>
        <div class="explora-num">01 · Formación académica</div>
        <h3>Proyectos académicos con problemas reales.</h3>
        <p>Sistemas, sitios y entregas donde se aplican metodologías, documentación y solución de necesidades concretas.</p>
        <span class="explora-cta">Ver proyectos académicos ${I('arrow-up-right')}</span>
      </a>
      <a href="${R}proyectos/#propios" class="explora-card" data-aos="fade-up" data-aos-delay="80">
        <div class="explora-icon">${I('rocket-takeoff-fill')}</div>
        <div class="explora-num">02 · Proyectos propios</div>
        <h3>Ideas personales llevadas a producto.</h3>
        <p>Sitios comerciales, sistemas en uso activo y propuestas visuales que exploran una oportunidad concreta.</p>
        <span class="explora-cta">Ver proyectos propios ${I('arrow-up-right')}</span>
      </a>
      <a href="${R}experimentos/" class="explora-card" data-aos="fade-up" data-aos-delay="160">
        <div class="explora-icon">${I('cpu-fill')}</div>
        <div class="explora-num">03 · Laboratorio creativo</div>
        <h3>Experimentos con código, IA e interacción.</h3>
        <p>Pruebas que no siempre son proyectos terminados, pero demuestran curiosidad y exploración técnica real.</p>
        <span class="explora-cta">Ver experimentos ${I('arrow-up-right')}</span>
      </a>
    </div>
  </div>
</section>

<section id="proyectos-destacados" class="section">
  <div class="container-custom">
    <div class="projects-head">
      <div><span class="eyebrow">Selección destacada</span><h2 class="section-title" data-aos="fade-up">Proyectos con impacto real.</h2></div>
      <p class="section-copy" data-aos="fade-up" data-aos-delay="100">Sistemas y sitios que hoy usa gente real, construidos con criterio visual y técnico.</p>
    </div>
    <div class="projects-board">
      ${destacados.map((p, i) => projectCard(p, 80 + i * 60, { descKey: 'descCorta' })).join('\n')}
    </div>
    <div class="projects-cta" data-aos="fade-up"><a href="${R}proyectos/" class="magnetic-btn">Ver todos los proyectos ${I('grid-1x2-fill')}</a></div>
  </div>
</section>

<section id="servicios" class="section">
  <div class="container-custom">
    <span class="eyebrow">Capacidades</span>
    <h2 class="section-title" data-aos="fade-up">Qué puedo construir.</h2>
    <div class="process-list">
      <article class="process-item" data-aos="fade-up"><span>01</span><h3>Websites con identidad</h3><p>Sitios modernos y de carga fluida, diseñados para destacar marcas o negocios digitales en cualquier dispositivo.</p></article>
      <article class="process-item" data-aos="fade-up"><span>02</span><h3>Landing pages de conversión</h3><p>Páginas pensadas para campañas de Meta Ads y Google Ads, con estructuras directas y llamados a la acción claros.</p></article>
      <article class="process-item" data-aos="fade-up"><span>03</span><h3>E-commerce a medida</h3><p>Tiendas en WordPress + WooCommerce o Shopify, con plantillas intervenidas y experiencias de compra intuitivas.</p></article>
      <article class="process-item" data-aos="fade-up"><span>04</span><h3>Sistemas y paneles funcionales</h3><p>Interfaces para centralizar datos, optimizar tareas manuales y agilizar flujos operativos internos.</p></article>
    </div>
  </div>
</section>

<section id="contacto" class="section">
  <div class="container-custom">
    <div class="contact-panel" data-aos="zoom-in">
      <span class="eyebrow">Contacto</span>
      <h2 class="section-title">¿Creamos una experiencia digital con identidad?</h2>
      <p class="section-copy">Disponible para trabajar en un equipo de desarrollo, colaborar en nuevas interfaces y proyectos a medida.</p>
      <div class="contact-actions">
        <a href="mailto:${SITIO.email}" class="magnetic-btn">Escribirme ${I('send-fill')}</a>
        ${cv ? `<a href="${R}assets/${cv}" download class="ghost-btn">Descargar CV ${I('download')}</a>` : ''}
      </div>
      <div class="social-row">
        <a href="${SITIO.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn de Yojhan Furuya">${I('linkedin')}</a>
        <a href="${SITIO.github}" target="_blank" rel="noopener" aria-label="GitHub de Yojhan Furuya">${I('github')}</a>
        <a href="${SITIO.instagram}" target="_blank" rel="noopener" aria-label="Instagram de Yojhan Furuya">${I('instagram')}</a>
        <a href="mailto:${SITIO.email}" aria-label="Enviar un email a Yojhan Furuya">${I('envelope')}</a>
      </div>
    </div>
  </div>
</section>`
  });
});

/* ── SOBRE MÍ (page-sobre-mi.php) ── */
addPage('sobre-mi/index.html', 1, () => layout({
  title: 'Sobre mí — Yojhan Furuya',
  description: 'Mi camino en el desarrollo web: formación en Duoc UC, proyectos para clientes reales, habilidades y forma de trabajar.',
  active: 'sobre-mi',
  body: `
<section class="am-hero" aria-labelledby="titulo-sobre-mi">
  <div class="breadcrumb-overlay container-custom">${breadcrumbs([INICIO, { label: 'Sobre mí' }])}</div>
  <div class="hero-stage">
    <h1 class="visually-hidden" id="titulo-sobre-mi">Yojhan Furuya — Desarrollador Front-End y diseñador web</h1>
    <div class="hero-bg-text" aria-hidden="true"><span class="bg-word">YOJHAN</span><span class="bg-word bg-word-2">FURUYA</span></div>
    <div class="hero-photo-glow"></div>
    ${fotoPerfil ? `<div class="hero-photo-wrap"><img src="${R}assets/${fotoPerfil}" alt="Foto de Yojhan Furuya" width="540" height="720" fetchpriority="high"></div>` : ''}
    <div class="hero-col-left">
      <div class="hero-name-block">
        <div class="hero-alias">Yojhan Furuya</div>
        <p class="hero-name-title">Frontend <span>Developer</span></p>
      </div>
      <div class="hero-socials">
        <a href="mailto:${SITIO.email}">${I('envelope-fill')} Email</a>
        <a href="${SITIO.linkedin}" target="_blank" rel="noopener">${I('linkedin')} LinkedIn</a>
        <a href="${SITIO.github}" target="_blank" rel="noopener">${I('github')} GitHub</a>
      </div>
      <div class="hero-flag">Viña del Mar · Chile</div>
    </div>
    <div class="hero-col-right">
      <div class="hero-role-lines"><div class="hero-role-line">Frontend Dev</div><div class="hero-role-line">UI Designer</div><div class="hero-role-line">Web Creator</div></div>
      <p class="hero-desc">Creo interfaces con identidad visual marcada. Diseño y desarrollo en un solo lugar.</p>
      <div class="hero-ctas">
        <a href="${R}proyectos/" class="magnetic-btn">Ver proyectos ${I('arrow-up-right')}</a>
        <a href="#contacto" class="ghost-btn">Hablemos ${I('chat-dots')}</a>
      </div>
    </div>
  </div>
  <div class="hero-mobile-info">
    <p class="hero-mobile-title" aria-hidden="true">Yojhan <span>Furuya</span></p>
    <div class="m-role">Frontend Developer · UI Designer</div>
    <p class="hero-mobile-desc">Creo interfaces con identidad visual fuerte y código limpio.</p>
    <div class="hero-mobile-ctas">
      <a href="${R}proyectos/" class="magnetic-btn">Ver proyectos ${I('arrow-up-right')}</a>
      <a href="#contacto" class="ghost-btn">Hablemos</a>
    </div>
  </div>
  <div class="hero-stats-bar">
    <div class="hero-stat"><div class="hero-stat-label">Años aprendiendo</div><div class="hero-stat-value">2+</div><div class="hero-stat-sub">Desde 2024</div></div>
    <div class="hero-stat"><div class="hero-stat-label">Proyectos</div><div class="hero-stat-value">${PROYECTOS.length}</div><div class="hero-stat-sub">Académicos, propios y clientes</div></div>
    <div class="hero-stat"><div class="hero-stat-label">Práctica</div><div class="hero-stat-value">360 h</div><div class="hero-stat-sub">Diseño web UX/UI</div></div>
    <div class="hero-stat hero-stat-stack">
      <div class="hero-stat-stack-row"><span class="hero-stat-label">Stack</span><span class="stat-tag stat-tag--accent">HTML5</span><span class="stat-tag">CSS3</span><span class="stat-tag">JS</span><span class="stat-tag">PHP</span></div>
      <div class="hero-stat-stack-row"><span class="hero-stat-label">Más</span><span class="stat-tag">WordPress</span><span class="stat-tag">Shopify</span><span class="stat-tag stat-tag--muted">MySQL</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container-custom">
    <div class="about-narrative">
      <div class="narrative-sticky" data-aos="fade-up">
        <span class="eyebrow">Sobre mí</span>
        <h2 class="narrative-big-title">Mi camino<br>en el <span class="stroke">desarrollo web</span></h2>
        <p class="narrative-bio">Antes de programar trabajé años en logística y bodega. Ahí vi de cerca cuánto tiempo se pierde con procesos mal resueltos, y eso es lo que hoy me mueve: construir sistemas que se usan todos los días.</p>
        <p class="narrative-bio">Estudio Desarrollo y Diseño Web en Duoc UC y aplico lo que aprendo en proyectos reales, desde sitios para clientes hasta sistemas construidos desde cero. Me interesa especialmente conectar el desarrollo con el marketing digital y la conversión.</p>
      </div>
      <div class="timeline timeline--about" data-aos="fade-up" data-aos-delay="120">
        <div class="timeline-item"><div class="tl-dot">${I('mortarboard-fill')}</div><div class="tl-content"><div class="tl-date">2024 — Presente</div><div class="tl-title">Desarrollo y Diseño Web · Duoc UC</div><p class="tl-desc">Formación técnica combinada con proyectos reales, desde sistemas web funcionales hasta landing pages orientadas a la conversión. Aprobé el optativo de JavaScript avanzado.</p></div></div>
        <div class="timeline-item"><div class="tl-dot">${I('code-slash')}</div><div class="tl-content"><div class="tl-date">2025</div><div class="tl-title">Primeros proyectos propios</div><p class="tl-desc">Construí mis primeros sitios desde cero, académicos y personales, y llegué a desarrollar soluciones para clientes.</p><div class="tl-tags"><span>HTML/CSS</span><span>Bootstrap</span><span>JavaScript</span></div></div></div>
        <div class="timeline-item"><div class="tl-dot">${I('cart3')}</div><div class="tl-content"><div class="tl-date">2025</div><div class="tl-title">Drake Experience — Ecommerce editorial</div><p class="tl-desc">Sitio ecommerce temático completo con WordPress y WooCommerce. Responsable de la arquitectura, la identidad visual y las funcionalidades de compra.</p><div class="tl-tags"><span>WordPress</span><span>WooCommerce</span><span>PHP</span></div></div></div>
        <div class="timeline-item"><div class="tl-dot">${I('lightning-charge-fill')}</div><div class="tl-content"><div class="tl-date">2025 — 2026</div><div class="tl-title">Sistemas web para clientes · Clickeao</div><p class="tl-desc">Sistemas que resuelven problemas reales de operación: comandas para un restaurante, gestión para un estudio de tatuajes, un gimnasio y una tienda de suscripciones.</p><div class="tl-tags"><span>Sistema de comandas</span><span>Ale.ink</span><span>GymPrime</span><span>TodoPSN</span></div></div></div>
        <div class="timeline-item"><div class="tl-dot">${I('graph-up-arrow')}</div><div class="tl-content"><div class="tl-date">Jun — Sep 2026</div><div class="tl-title">Práctica profesional · Natural Telchi</div><p class="tl-desc">Diseño de landing pages de conversión para productos de lanzamiento de una importadora y envasadora de suplementos, pensadas para campañas en Meta Ads y Google Ads.</p><div class="tl-tags"><span>UX/UI</span><span>Landing pages</span><span>Marketing digital</span></div></div></div>
        <div class="timeline-item"><div class="tl-dot tl-dot--accent">${I('stars')}</div><div class="tl-content"><div class="tl-date tl-date--accent">Hoy</div><div class="tl-title">Buscando mi próximo equipo</div><p class="tl-desc">Disponible para sumarme a un equipo de desarrollo web, en Chile o remoto, mientras sigo construyendo productos propios.</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--no-top">
  <div class="container-custom">
    <span class="eyebrow">Habilidades</span>
    <h2 class="section-title section-title--skills" data-aos="fade-up">Lo que tengo para ofrecer.</h2>
    <div class="skills-bento">
      <div class="bento-card b-1" data-aos="fade-up"><div class="bento-glow glow-yellow"></div><div class="bento-icon icon-yellow">${I('braces')}</div><h3>Stack de trabajo</h3><p>Tecnologías que uso en proyectos reales, desde la maqueta hasta el despliegue.</p><div class="bento-tech-list"><span>HTML5</span><span>CSS3</span><span>JavaScript</span><span>PHP</span><span>MySQL</span><span>APIs REST</span><span>WordPress</span><span>WooCommerce</span><span>Shopify</span><span>Git</span></div></div>
      <div class="bento-card b-2" data-aos="fade-up" data-aos-delay="60"><div class="bento-glow glow-cyan"></div><div class="bento-icon icon-cyan">${I('palette2')}</div><h3>Diseño UI</h3><p>Combino identidad visual, experiencia de usuario y funcionalidad para crear soluciones que se sienten bien de usar.</p></div>
      <div class="bento-card b-3 bento-card--centered" data-aos="fade-up" data-aos-delay="120"><div class="bento-glow glow-purple"></div><div class="bento-big-num">${PROYECTOS.length}</div><h3>Proyectos</h3><p>Académicos, propios y para clientes, documentados con su problema, solución y resultado.</p></div>
      <div class="bento-card b-4" data-aos="fade-up" data-aos-delay="60"><div class="bento-icon icon-yellow">${I('bar-chart-line-fill')}</div><h3>Nivel técnico</h3>
        <div class="skill-bars">
          <div class="skill-bar-item"><div class="skill-bar-head"><span>HTML / CSS</span><span>90%</span></div><div class="skill-bar-track"><div class="skill-bar-fill" data-width="90"></div></div></div>
          <div class="skill-bar-item"><div class="skill-bar-head"><span>JavaScript</span><span>80%</span></div><div class="skill-bar-track"><div class="skill-bar-fill" data-width="80"></div></div></div>
          <div class="skill-bar-item"><div class="skill-bar-head"><span>PHP / MySQL</span><span>70%</span></div><div class="skill-bar-track"><div class="skill-bar-fill" data-width="70"></div></div></div>
          <div class="skill-bar-item"><div class="skill-bar-head"><span>WordPress / Shopify</span><span>78%</span></div><div class="skill-bar-track"><div class="skill-bar-fill" data-width="78"></div></div></div>
        </div>
      </div>
      <div class="bento-card b-5" data-aos="fade-up" data-aos-delay="120"><div class="bento-glow glow-cyan"></div><div class="bento-icon icon-cyan">${I('megaphone-fill')}</div><h3>Marketing y conversión</h3><p>Landing pages para campañas en Meta Ads, captación de clientes y modelos de negocio digital conectados con el desarrollo.</p></div>
      <div class="bento-card b-6 bento-card--available" data-aos="fade-up" data-aos-delay="180"><div class="bento-icon icon-yellow">${I('robot')}</div><h3>IA en el flujo de trabajo</h3><p>Uso IA para programar más rápido y automatizar procesos, siempre entendiendo y revisando el código que entrego.</p></div>
    </div>
  </div>
</section>

<section class="section section--no-top">
  <div class="container-custom">
    <span class="eyebrow">Mi enfoque</span>
    <h2 class="section-title section-title--approach" data-aos="fade-up">Así trabajo.</h2>
    <p class="section-lead" data-aos="fade-up" data-aos-delay="60">No sigo plantillas. Cada proyecto tiene su lógica.</p>
    <div class="scroll-hint" data-aos="fade-up" data-aos-delay="80">${I('arrow-left-right')} Desliza horizontalmente</div>
    <div class="approach-scroll-wrap" data-aos="fade-up" data-aos-delay="100" tabindex="0" aria-label="Pasos de mi forma de trabajar">
      <div class="approach-track" id="approachTrack">
        <div class="approach-card"><div class="approach-card-accent"></div><div class="approach-num">01</div><h3>Entender primero</h3><p>Antes de escribir una línea de código, entiendo el objetivo real: ¿qué necesita comunicar? ¿A quién? ¿Qué acción debe provocar?</p></div>
        <div class="approach-card"><div class="approach-card-accent"></div><div class="approach-num">02</div><h3>Diseñar con intención</h3><p>Cada decisión visual tiene un propósito. Trabajo junto al cliente para entender su visión y aportar criterio propio.</p></div>
        <div class="approach-card"><div class="approach-card-accent"></div><div class="approach-num">03</div><h3>Código pensado a futuro</h3><p>Escribo código limpio y bien estructurado, pensando en quien lo intervenga después, ya sea otra persona o yo mismo en seis meses.</p></div>
        <div class="approach-card"><div class="approach-card-accent"></div><div class="approach-num">04</div><h3>Detalles que suman</h3><p>Las microinteracciones y las transiciones transforman un sitio común en uno que marca presencia y refuerza la identidad de la marca.</p></div>
        <div class="approach-card"><div class="approach-card-accent"></div><div class="approach-num">05</div><h3>Iterar sin miedo</h3><p>El primer resultado nunca es el final. Reviso, ajusto y mejoro hasta que el proyecto cumple lo que promete.</p></div>
        <div class="approach-card approach-card--accent"><div class="approach-card-accent"></div><div class="approach-num approach-num--faded">06</div><h3>Presente en cada etapa</h3><p>Mantengo comunicación constante durante todo el desarrollo. Cuando hay compromiso de ambas partes, el proyecto avanza mejor.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--no-top">
  <div class="container-custom">
    <span class="eyebrow">La propuesta</span>
    <h2 class="section-title section-title--why" data-aos="fade-up">¿Por qué trabajar conmigo?</h2>
    <div class="why-grid">
      <div class="why-big-panel" data-aos="fade-up">
        <h3 class="why-subtitle">Diseño, desarrollo y aprendizaje constante.</h3>
        <p>Me interesa crear soluciones digitales útiles, fáciles de usar y visualmente cuidadas. Disfruto tanto el diseño como el desarrollo, así que puedo participar desde la idea hasta la implementación.</p>
        <p>Sigo formándome y aplicando lo aprendido en proyectos académicos, personales y para clientes. Cada proyecto es una oportunidad para mejorar y sumar experiencia real.</p>
        <div class="why-checkmarks">
          <div class="why-check"><div class="why-check-icon">${I('check2')}</div><div class="why-check-text"><strong>Diseño y desarrollo</strong><span>Participo tanto en la construcción visual como en el desarrollo de cada proyecto.</span></div></div>
          <div class="why-check"><div class="why-check-icon">${I('check2')}</div><div class="why-check-text"><strong>Experiencia práctica</strong><span>Sistemas en uso para clientes reales y una práctica profesional en diseño web.</span></div></div>
          <div class="why-check"><div class="why-check-icon">${I('check2')}</div><div class="why-check-text"><strong>Comunicación cercana</strong><span>Mantengo contacto constante y procuro que cada etapa del proyecto sea clara para todos.</span></div></div>
          <div class="why-check"><div class="why-check-icon">${I('check2')}</div><div class="why-check-text"><strong>Compromiso con el crecimiento</strong><span>Veo cada proyecto como una oportunidad para construir soluciones cada vez más completas.</span></div></div>
        </div>
      </div>
      <div class="why-side" data-aos="fade-up" data-aos-delay="120">
        <div class="why-mini"><div class="why-mini-head"><div class="why-mini-icon icon-yellow">${I('eye')}</div><h4>Atención al detalle</h4></div><p>Cuido la presentación visual, la organización y la experiencia de uso en cada proyecto.</p></div>
        <div class="why-mini"><div class="why-mini-head"><div class="why-mini-icon icon-cyan">${I('puzzle')}</div><h4>Soluciones adaptadas</h4></div><p>Cada proyecto tiene necesidades distintas. Construyo soluciones acordes a cada situación y objetivo.</p></div>
        <div class="why-mini"><div class="why-mini-head"><div class="why-mini-icon icon-purple">${I('graph-up-arrow')}</div><h4>Aprendizaje continuo</h4></div><p>Dedico tiempo a aprender nuevas tecnologías, tendencias y buenas prácticas.</p></div>
        <div class="why-mini why-mini--highlight"><div class="why-mini-head"><div class="why-mini-icon icon-yellow">${I('chat-heart')}</div><h4>Compromiso y comunicación</h4></div><p>Me involucro activamente y valoro trabajar con personas que también se comprometen con sus objetivos.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="contacto" class="section">
  <div class="container-custom">
    <div class="am-contact-panel" data-aos="zoom-in">
      <span class="eyebrow">Contacto</span>
      <h2 class="section-title">¿Quieres conversar sobre una <span class="accent">idea, proyecto o puesto?</span></h2>
      <p class="section-copy">Si crees que puedo aportar a tu equipo o proyecto, o simplemente quieres intercambiar ideas, escríbeme.</p>
      <div class="contact-actions">
        <a href="mailto:${SITIO.email}" class="magnetic-btn">Escribirme ${I('send-fill')}</a>
        ${cv ? `<a href="${R}assets/${cv}" download class="ghost-btn">Descargar CV ${I('download')}</a>` : ''}
      </div>
      <div class="social-row">
        <a href="${SITIO.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I('linkedin')}</a>
        <a href="${SITIO.github}" target="_blank" rel="noopener" aria-label="GitHub">${I('github')}</a>
        <a href="${SITIO.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I('instagram')}</a>
        <a href="mailto:${SITIO.email}" aria-label="Email">${I('envelope')}</a>
      </div>
    </div>
  </div>
</section>`
}));

/* ── PROYECTOS (page-proyectos.php) ── */
addPage('proyectos/index.html', 1, () => {
  const by = g => PROYECTOS.filter(p => p.grupo === g);
  const exps = by('experimento');
  const grid = (list, delayStep = 70) => list.length ? list.map((p, i) => projectCard(p, i * delayStep)).join('\n') : '<p class="section-text" style="grid-column:1/-1">Todavía no hay proyectos publicados en esta categoría.</p>';
  const feat = PROYECTOS.find(p => p.destacado === 1) || PROYECTOS[0];
  return layout({
    title: 'Proyectos — Yojhan Furuya',
    description: 'Proyectos académicos, sistemas para clientes y experimentos: comandas para restaurantes, ecommerce, auditorías UX y más.',
    active: 'proyectos',
    image: feat.portada,
    body: `
<header class="page-hero" id="inicio">
  <div class="container-custom">
    <div class="breadcrumb-holder" data-aos="fade-up">${breadcrumbs([INICIO, { label: 'Proyectos' }])}</div>
    <div class="hero-panel" data-aos="fade-up">
      <div class="hero-copy">
        <div>
          <span class="eyebrow">Archivo de proyectos</span>
          <h1 class="hero-title">Proyectos, sistemas y productos digitales.</h1>
          <p class="hero-text">Parte de mi recorrido como desarrollador web: proyectos de mi formación académica, sistemas creados para resolver necesidades reales, iniciativas propias y experimentos donde exploro nuevas tecnologías e interfaces.</p>
        </div>
        <div class="hero-stats">
          <div class="stat-card"><strong>Académicos</strong><span>Proyectos de mi formación, con análisis, desarrollo y resolución de problemas.</span></div>
          <div class="stat-card"><strong>Propios</strong><span>Sistemas creados por iniciativa propia para resolver necesidades concretas.</span></div>
          <div class="stat-card"><strong>Lab</strong><span>Exploración de tecnologías, componentes e ideas para futuros proyectos.</span></div>
        </div>
      </div>
      <aside class="hero-aside">
        <div class="featured-card">
          <img src="${asset(feat.portada)}" alt="Portada del proyecto ${esc(feat.titulo)}" width="1200" height="800" fetchpriority="high">
          <div class="featured-overlay"><div><h2>Una forma más clara de presentar mi trabajo.</h2><p>Cada proyecto está ordenado según su contexto: qué problema resolvía y cuál fue mi participación.</p></div></div>
        </div>
        <nav class="category-pills" aria-label="Categorías">
          <a href="#formacion">${I('mortarboard-fill')} Formación académica</a>
          <a href="#propios">${I('rocket-takeoff-fill')} Proyectos propios</a>
          <a href="#experimentos">${I('cpu-fill')} Laboratorio</a>
        </nav>
      </aside>
    </div>
  </div>
</header>

<section class="section" id="formacion">
  <div class="container-custom">
    <div class="section-head">
      <div><span class="eyebrow">01 · Formación académica</span><h2 class="section-title" data-aos="fade-up">Primeros proyectos y soluciones funcionales.</h2></div>
      <p class="section-text" data-aos="fade-up" data-aos-delay="100">Proyectos de mi etapa formativa: el espacio donde empecé a transformar ideas en soluciones, aprendiendo a analizar necesidades, diseñar interfaces y construir sistemas para problemas concretos.</p>
    </div>
    <div class="projects-grid">${grid(by('universidad'))}</div>
  </div>
</section>

<section class="section" id="propios">
  <div class="container-custom">
    <div class="section-head">
      <div><span class="eyebrow">02 · Proyectos propios</span><h2 class="section-title" data-aos="fade-up">Soluciones creadas desde la iniciativa.</h2></div>
      <p class="section-text" data-aos="fade-up" data-aos-delay="100">Proyectos nacidos de necesidades reales y oportunidades detectadas: sistemas de gestión, herramientas digitales y productos web donde participo en todas las etapas, desde la idea hasta la implementación.</p>
    </div>
    <div class="projects-grid">${grid(by('propio'))}</div>
  </div>
</section>

<section class="section" id="experimentos">
  <div class="container-custom">
    <div class="section-head">
      <div><span class="eyebrow">03 · Laboratorio creativo</span><h2 class="section-title" data-aos="fade-up">Exploración, aprendizaje y nuevas ideas.</h2></div>
      <p class="section-text" data-aos="fade-up" data-aos-delay="100">Pruebas, prototipos y desarrollos experimentales para explorar tecnologías. Muchas de estas ideas terminan convertidas en componentes o funcionalidades que aplico en proyectos reales.</p>
    </div>
    <a href="${R}experimentos/" class="lab-banner" data-aos="fade-up">
      <div class="lab-banner-copy">
        <div class="lab-banner-icon">${I('cpu-fill')}</div>
        <div><h3>Explorar todos los experimentos</h3><p>Pruebas, prototipos e ideas en desarrollo. No siempre son proyectos terminados, pero muestran mi proceso de aprendizaje y exploración técnica.</p></div>
      </div>
      <div class="lab-banner-thumbs">${exps.slice(0, 3).map(p => `<img src="${asset(p.portada)}" alt="" loading="lazy" width="46" height="46">`).join('')}</div>
      <span class="lab-banner-arrow">${I('arrow-right')}</span>
    </a>
  </div>
</section>

${contactPanel({ title: '¿Quieres ver más detalles de algún proyecto?', text: 'Puedo ampliar cada caso con documentación, capturas, videos, repositorio, tecnologías usadas y mejoras futuras.', secondary: `<a href="${R}" class="ghost-btn">${I('arrow-left')} Volver al inicio</a>` })}`
  });
});

/* ── EXPERIMENTOS (page-experimentos.php) ── */
addPage('experimentos/index.html', 1, () => {
  const exps = PROYECTOS.filter(p => p.grupo === 'experimento');
  return layout({
    title: 'Experimentos — Yojhan Furuya',
    description: 'Laboratorio creativo: prototipos y sistemas en exploración como Ale.ink, Fascia y GymPrime.',
    active: 'proyectos',
    mainClass: 'page-experimentos',
    image: exps[0]?.portada,
    body: `
<section class="exp-hero" id="exp-hero" aria-roledescription="carrusel" aria-label="Experimentos">
  <div class="exp-hero-bg-stack" aria-hidden="true">
    ${exps.map((e, i) => `<div class="exp-hero-bg${i === 0 ? ' is-active' : ''}" data-index="${i}" style="background-image:${bg(e.fondo || e.galeria[0] || e.portada)}"></div>`).join('\n    ')}
    <div class="exp-hero-overlay"></div>
  </div>
  <div class="exp-hero-content container-custom">
    <div class="exp-hero-top">
      ${breadcrumbs([INICIO, { label: 'Proyectos', href: 'proyectos/' }, { label: 'Experimentos' }], 'exp-breadcrumb')}
      <span class="exp-lab-tag">${I('cpu-fill')} Laboratorio creativo</span>
    </div>
    <div class="exp-hero-grid">
      <div class="exp-hero-info" aria-live="polite">
        ${exps.map((e, i) => `<div class="exp-info-block${i === 0 ? ' is-active' : ''}" data-index="${i}">
          <span class="exp-kicker">${esc(e.kicker)}</span>
          ${i === 0 ? `<h1 class="exp-title">${esc(e.titulo)}</h1>` : `<h2 class="exp-title">${esc(e.titulo)}</h2>`}
          <p class="exp-desc">${esc(e.desc)}</p>
          <button class="exp-ver-detalle" type="button" data-target="exp-detalle-${e.slug}">Ver más detalles ${I('arrow-down-circle-fill')}</button>
        </div>`).join('\n        ')}
      </div>
      <div class="exp-carousel">
        <div class="exp-stack" id="exp-track">
          ${exps.map((e, i) => `<button class="exp-card${i === 0 ? ' is-active' : ''}" type="button" data-index="${i}" style="background-image:${bg(e.portada)}" aria-label="Ver ${esc(e.titulo)}"><span class="exp-card-overlay"></span><span class="exp-card-title">${esc(e.titulo)}</span></button>`).join('\n          ')}
        </div>
        <div class="exp-carousel-controls">
          <button class="exp-carousel-arrow prev" id="exp-prev" type="button" aria-label="Experimento anterior">${I('chevron-left')}</button>
          <button class="exp-carousel-arrow next" id="exp-next" type="button" aria-label="Experimento siguiente">${I('chevron-right')}</button>
          <div class="exp-carousel-progress"><span id="exp-progress-bar"></span></div>
          <div class="exp-carousel-counter"><span id="exp-counter-current">01</span> / ${pad(exps.length)}</div>
        </div>
      </div>
    </div>
  </div>
</section>

${exps.map((e, i) => `<div class="exp-detalle${i === 0 ? '' : ' is-hidden'}" id="exp-detalle-${e.slug}" data-index="${i}">
  <section class="section exp-detalle-head">
    <div class="container-custom">
      <div class="exp-detalle-grid">
        <div class="exp-detalle-intro" data-aos="fade-up">
          <span class="exp-kicker">${esc(e.kicker)}</span>
          <h2 class="exp-detalle-title">${esc(e.titulo)}</h2>
          <p class="exp-detalle-desc">${esc(e.desc)}</p>
          <div class="exp-detalle-meta">
            <div class="meta-item"><small>Año</small><span>${esc(e.anio)}</span></div>
            <div class="meta-item"><small>Estado</small><span class="meta-status-dot">${esc(e.estado)}</span></div>
          </div>
          <div class="tags">${e.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
          <p style="margin-top:20px"><a class="btn-ghost" href="${url(e.slug)}">Abrir ficha completa ${I('arrow-up-right')}</a></p>
        </div>
        <div data-aos="fade-up" data-aos-delay="100">${gallery(e, { badge: false, cls: 'exp-detalle-gallery' })}</div>
      </div>
      ${statsStrip(e, 'data-aos="fade-up"')}
    </div>
  </section>
  ${detailSections(e, 'exp')}
</div>`).join('\n')}

${contactPanel({ title: '¿Quieres ver más detalles de algún experimento?', text: 'Puedo ampliar cualquiera de estos con código, decisiones técnicas o una demo en vivo.', primary: 'btn-main', secondary: `<a href="${R}proyectos/" class="btn-ghost">${I('arrow-left')} Volver a proyectos</a>` })}`
  });
});

/* ── PROYECTO INDIVIDUAL (single-proyectos.php) ── */
PROYECTOS.forEach((p, idx) => {
  addPage(`proyectos/${p.slug}/index.html`, 2, () => {
    const g = GRUPO[p.grupo];
    const isExp = p.grupo === 'experimento';
    const related = [1, 2, 3].map(k => PROYECTOS[(idx + k) % PROYECTOS.length]);
    const crumbs = [INICIO, { label: 'Proyectos', href: 'proyectos/' }];
    if (isExp) crumbs.push({ label: 'Experimentos', href: 'experimentos/' });
    crumbs.push({ label: p.titulo });
    return layout({
      title: `${p.titulo} — Yojhan Furuya`,
      description: p.desc.length > 160 ? p.desc.slice(0, 157).replace(/\s+\S*$/, '') + '…' : p.desc,
      active: 'proyectos',
      mainClass: `single-proyecto${isExp ? ' single-experimento' : ''}`,
      image: p.portada,
      jsonld: { '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.titulo, description: p.desc, author: { '@type': 'Person', name: SITIO.nombre }, keywords: p.tags.join(', '), dateCreated: p.anio.slice(0, 4) },
      body: `
<button id="back-top-proyecto" class="back-top-proyecto" type="button" aria-label="Volver arriba">${I('arrow-up')}</button>

<section class="project-hero">
  <div class="container-custom">
    ${isExp ? `<div class="lab-tag" data-aos="fade-up">${I('cpu-fill')} Laboratorio creativo — prueba o exploración, no necesariamente un proyecto terminado</div>` : ''}
    <div class="breadcrumb-holder" data-aos="fade-up">${breadcrumbs(crumbs)}</div>
    <div class="hero-grid">
      <div data-aos="fade-up">${gallery(p)}</div>
      <aside class="info-panel" data-aos="fade-left" data-aos-delay="100">
        <div class="info-card">
          <div class="project-kicker">${esc(p.kicker)}</div>
          <h1 class="project-title">${esc(p.titulo)}</h1>
          <p class="project-desc">${esc(p.desc)}</p>
          <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        </div>
        <div class="meta-grid">
          <div class="meta-item"><small>Categoría</small><span>${g.categoria}</span></div>
          <div class="meta-item"><small>Año</small><span>${esc(p.anio)}</span></div>
          <div class="meta-item"><small>Rol</small><span>Diseño &amp; Desarrollo</span></div>
          <div class="meta-item"><small>Estado</small><span class="meta-status-dot">${esc(p.estado)}</span></div>
        </div>
        <div class="btn-row">
          ${p.video ? `<a href="#demo" class="btn-main">Ver demo en video ${I('play-circle-fill')}</a>` : ''}
          ${(p.links || []).map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener" class="${p.video ? 'btn-ghost' : 'btn-main'}">${esc(l.label)} ${I('arrow-up-right')}</a>`).join('')}
          <button class="btn-ghost" id="copy-link-btn" type="button">${I('link-45deg')} Copiar enlace del proyecto</button>
          <a href="${R}proyectos/" class="btn-ghost">${I('arrow-left')} Volver a proyectos</a>
        </div>
      </aside>
    </div>
    ${statsStrip(p)}
  </div>
</section>
${detailSections(p, 'single').replace('<section class="section section--no-top">\n  <div class="container-custom">\n    <span class="eyebrow" data-aos="fade-up">Demo en video</span>', '<section class="section section--no-top" id="demo">\n  <div class="container-custom">\n    <span class="eyebrow" data-aos="fade-up">Demo en video</span>')}

<section class="section section--no-top">
  <div class="container-custom">
    <span class="eyebrow" data-aos="fade-up">Más proyectos</span>
    <h2 class="section-title section-title--space-lg" data-aos="fade-up">También podría interesarte.</h2>
    <div class="related-grid">
      ${related.map((r, i) => `<a href="${url(r.slug)}" class="related-card" data-aos="fade-up"${i ? ` data-aos-delay="${i * 60}"` : ''}>
        <div class="related-img"><img src="${asset(r.portada)}" alt="" loading="lazy" decoding="async" width="800" height="500"><span class="related-open">${I('arrow-up-right')}</span></div>
        <div class="related-body"><div class="related-kicker">${esc(r.kicker)}</div><h3>${esc(r.titulo)}</h3></div>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

${contactPanel({ title: '¿Quieres ver más detalles de este proyecto?', text: 'Puedo ampliar el caso con documentación, capturas adicionales, repositorio, decisiones técnicas y mejoras futuras.', primary: 'btn-main', secondary: `<a href="${R}proyectos/" class="btn-ghost">${I('arrow-left')} Ver todos los proyectos</a>` })}`
    });
  });
});

/* ── 404 ── */
addPage('404.html', 0, () => layout({
  title: 'Página no encontrada — Yojhan Furuya',
  description: 'La página que buscas no existe.',
  active: '',
  body: `<section class="not-found"><div class="container-custom">
  <span class="eyebrow">Error 404</span>
  <h1 class="hero-title">Esta página no <span class="outline">existe.</span></h1>
  <p class="section-text">Puede que el enlace sea antiguo. Mis proyectos siguen aquí:</p>
  <div class="contact-actions"><a href="/" class="magnetic-btn">Ir al inicio ${I('arrow-right')}</a><a href="/proyectos/" class="ghost-btn">Ver proyectos</a></div>
</div></section>`
}));

/* ═════════════════════ ESCRIBIR /dist ═════════════════════ */
fs.rmSync(OUT, { recursive: true, force: true });
for (const pg of pages) {
  R = pg.depth ? '../'.repeat(pg.depth) : '';
  currentPath = pg.rel.replace(/index\.html$/, '');
  if (pg.rel === '404.html') R = '/';
  const htmlOut = pg.render();
  const dest = path.join(OUT, pg.rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, htmlOut);
}

/* CSS: une los archivos en orden */
const cssFiles = fs.readdirSync(path.join(SRC, 'css')).filter(f => f.endsWith('.css')).sort();
let css = cssFiles.map(f => fs.readFileSync(path.join(SRC, 'css', f), 'utf8')).join('\n');
let js = fs.readFileSync(path.join(SRC, 'js', 'main.js'), 'utf8');

/* Minificar si esbuild está instalado (npm install) */
try {
  const esbuild = await import('esbuild');
  css = (await esbuild.transform(css, { loader: 'css', minify: true, target: ['chrome100', 'safari15', 'firefox100'] })).code;
  js = (await esbuild.transform(js, { loader: 'js', minify: true, target: 'es2018' })).code;
} catch { /* sin esbuild: se copian legibles */ }
fs.mkdirSync(path.join(OUT, 'assets/css'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'assets/js'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'assets/css/main.css'), css);
fs.writeFileSync(path.join(OUT, 'assets/js/main.js'), js);

/* Sprite de íconos: solo los que se usan */
const spriteFile = path.join(SRC, 'icons.svg');
try {
  const iconsDir = path.join(DIR, 'node_modules/bootstrap-icons/icons');
  if (fs.existsSync(iconsDir)) {
    const symbols = [...usedIcons].sort().map(n => {
      const f = path.join(iconsDir, n + '.svg');
      if (!fs.existsSync(f)) { console.warn('  ícono no encontrado:', n); return ''; }
      const svg = fs.readFileSync(f, 'utf8');
      const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 16 16';
      const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
      return `<symbol id="${n}" viewBox="${vb}">${inner}</symbol>`;
    }).join('');
    fs.writeFileSync(spriteFile, `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`);
  }
} catch (e) { console.warn('No se pudo regenerar el sprite:', e.message); }
fs.copyFileSync(spriteFile, path.join(OUT, 'assets/icons.svg'));

/* Copiar estáticos */
const copyDir = (from, to) => { if (fs.existsSync(from)) fs.cpSync(from, to, { recursive: true }); };
copyDir(path.join(SRC, 'img'), path.join(OUT, 'assets/img'));
copyDir(path.join(SRC, 'uploads'), path.join(OUT, 'assets/uploads'));
copyDir(path.join(SRC, 'cv'), path.join(OUT, 'assets/cv'));
fs.copyFileSync(path.join(SRC, 'favicon.svg'), path.join(OUT, 'assets/favicon.svg'));
if (SITIO.url) {
  const base = SITIO.url.replace(/\/$/, '');
  const urls = pages.filter(p => p.rel !== '404.html').map(p => `<url><loc>${base}/${p.rel.replace(/index\.html$/, '')}</loc></url>`).join('');
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
}

console.log(`✓ ${pages.length} páginas generadas en dist/  ·  CSS ${(css.length / 1024).toFixed(1)} KB · JS ${(js.length / 1024).toFixed(1)} KB · ${usedIcons.size} íconos`);
if (!fotoPerfil) console.log('  · Falta tu foto: guárdala como src/img/foto-perfil.webp para que aparezca en "Sobre mí".');
if (!cv) console.log('  · Falta el CV: guárdalo como src/cv/cv-yojhan-furuya.pdf para activar los botones "Descargar CV".');
