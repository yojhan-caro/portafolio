/**
 * main.js — Portafolio Yojhan Furuya (v3, sitio estático)
 * Mismos efectos del tema WordPress, sin jQuery, Bootstrap ni AOS.
 */
(function () {
  'use strict';

  var html = document.documentElement;
  var ROOT = html.getAttribute('data-root') || '';
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Ícono del sprite (para elementos creados por JS) */
  function icon(name) {
    return '<i class="bi" aria-hidden="true"><svg><use href="' + ROOT + 'assets/icons.svg#' + name + '"/></svg></i>';
  }

  /* ════════════════════════════════════════
     REVEAL AL HACER SCROLL (reemplazo liviano de AOS)
     ════════════════════════════════════════ */
  (function () {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-aos]'));
    if (!els.length) return;
    function done(el) {
      el.classList.add('aos-animate');
      /* Al terminar, se quita el atributo para que cada card recupere
         sus propias transiciones de hover (no las del reveal) */
      var clear = function () { el.removeAttribute('data-aos'); el.style.transitionDelay = ''; };
      el.addEventListener('transitionend', clear, { once: true });
      setTimeout(clear, 1600 + (parseInt(el.getAttribute('data-aos-delay'), 10) || 0));
    }
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(done); return; }
    els.forEach(function (el) {
      var d = parseInt(el.getAttribute('data-aos-delay'), 10);
      if (d) el.style.transitionDelay = d + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { done(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.01 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ════════════════════════════════════════
     CURSOR BLOB — forma orgánica que se estira con la velocidad
     ════════════════════════════════════════ */
  (function () {
    var cursorEl = document.getElementById('cursor-blob');
    if (!cursorEl || !finePointer) return;
    html.classList.add('has-cursor');

    var startPos = window.__pmCursorLast || window.__pmCursorInit || null;
    var mouseX = startPos ? startPos.x : -100, mouseY = startPos ? startPos.y : -100;
    var blobX = mouseX, blobY = mouseY;
    var blobPath = cursorEl.querySelector('.blob-path');
    if (startPos) cursorEl.style.opacity = '1';

    var basePoints = [[50,12],[70,10],[88,22],[92,45],[88,68],[72,85],[50,90],[28,85],[12,68],[8,45],[12,22],[30,10]];
    function lerp(a, b, t) { return a + (b - a) * t; }
    function f(n) { return n.toFixed(1); }
    function getBlobPath(vx, vy) {
      var speed = Math.sqrt(vx * vx + vy * vy);
      var stretch = Math.min(speed * 0.7, 38), squish = Math.min(speed * 0.25, 14);
      var angle = Math.atan2(vy, vx), cos = Math.cos(angle), sin = Math.sin(angle);
      var pc = -sin, ps = cos;
      var p = basePoints.map(function (pt) {
        var dx = pt[0] - 50, dy = pt[1] - 50;
        var proj = dx * cos + dy * sin, perp = dx * pc + dy * ps;
        return [50 + dx + cos * proj * stretch * 0.022 - pc * perp * squish * 0.012,
                50 + dy + sin * proj * stretch * 0.022 - ps * perp * squish * 0.012];
      });
      return 'M' + f(p[0][0]) + ',' + f(p[0][1]) +
        ' C' + f(p[1][0]) + ',' + f(p[1][1]) + ' ' + f(p[2][0]) + ',' + f(p[2][1]) + ' ' + f(p[3][0]) + ',' + f(p[3][1]) +
        ' C' + f(p[4][0]) + ',' + f(p[4][1]) + ' ' + f(p[5][0]) + ',' + f(p[5][1]) + ' ' + f(p[6][0]) + ',' + f(p[6][1]) +
        ' C' + f(p[7][0]) + ',' + f(p[7][1]) + ' ' + f(p[8][0]) + ',' + f(p[8][1]) + ' ' + f(p[9][0]) + ',' + f(p[9][1]) +
        ' C' + f(p[10][0]) + ',' + f(p[10][1]) + ' ' + f(p[11][0]) + ',' + f(p[11][1]) + ' ' + f(p[0][0]) + ',' + f(p[0][1]) + 'Z';
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorEl.style.opacity = '1';
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { cursorEl.style.opacity = '0'; });

    var running = true;
    (function animate() {
      if (!running) return;
      var vx = mouseX - blobX, vy = mouseY - blobY;
      blobX = lerp(blobX, mouseX, 0.18); blobY = lerp(blobY, mouseY, 0.18);
      cursorEl.style.left = blobX + 'px'; cursorEl.style.top = blobY + 'px';
      if (blobPath && !reduceMotion) blobPath.setAttribute('d', getBlobPath(vx, vy));
      requestAnimationFrame(animate);
    })();
    document.addEventListener('visibilitychange', function () {
      var hidden = document.hidden;
      if (hidden) running = false; else if (!running) { running = true; requestAnimationFrame(function a() { if (running) { var vx = mouseX - blobX, vy = mouseY - blobY; blobX = lerp(blobX, mouseX, 0.18); blobY = lerp(blobY, mouseY, 0.18); cursorEl.style.left = blobX + 'px'; cursorEl.style.top = blobY + 'px'; if (blobPath && !reduceMotion) blobPath.setAttribute('d', getBlobPath(vx, vy)); requestAnimationFrame(a); } }); }
    });

    var hoverSel = 'a, button, label[for], [role="button"], .project-card, .metric-card, .stat-card, .bento-card, .approach-card, .why-mini, .explora-card, .related-card, .timeline-item';
    document.addEventListener('mouseover', function (e) { if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover-active'); });
    document.addEventListener('mouseout', function (e) { if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover-active'); });
    document.addEventListener('mousedown', function () { document.body.classList.add('cursor-clicking'); });
    document.addEventListener('mouseup', function () { document.body.classList.remove('cursor-clicking'); });
  })();

  /* ════════════════════════════════════════
     ZOOM + BLUR AL HACER CLIC EN CARDS
     ════════════════════════════════════════ */
  (function () {
    var overlay = document.createElement('div');
    overlay.className = 'card-focus-overlay';
    var focusBorder = document.createElement('div');
    focusBorder.className = 'card-focus-border';
    document.body.appendChild(overlay);
    document.body.appendChild(focusBorder);

    var CARD_SEL = '.project-card, .metric-card, .sobre-mi-card, .explora-card, .process-item, .moodboard-card, .bento-card, .approach-card, .why-mini, .why-big-panel, .tl-content, .narrative-sticky, .stat-card, .detail-block, .future-card, .tech-card, .feature-item, .info-card, .related-card, .lab-banner, .exp-detalle-intro, .contact-panel, .am-contact-panel, .why-check, .sobre-mi-stat';
    var focused = null, timer = null, raf = null, PAD = 16;

    function update() {
      if (!focused) return;
      var r = focused.getBoundingClientRect();
      var x1 = Math.max(0, r.left - PAD), y1 = Math.max(0, r.top - PAD);
      var x2 = Math.min(innerWidth, r.right + PAD), y2 = Math.min(innerHeight, r.bottom + PAD);
      overlay.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ' + x1 + 'px ' + y1 + 'px, ' + x1 + 'px ' + y2 + 'px, ' + x2 + 'px ' + y2 + 'px, ' + x2 + 'px ' + y1 + 'px, ' + x1 + 'px ' + y1 + 'px)';
      var br = getComputedStyle(focused).borderRadius;
      focusBorder.style.cssText = 'left:' + x1 + 'px;top:' + y1 + 'px;width:' + (x2 - x1) + 'px;height:' + (y2 - y1) + 'px;border-radius:' + (br && br !== '0px' ? br : '22px');
      raf = requestAnimationFrame(update);
    }
    function focus(card) {
      if (focused === card) { unfocus(); return; }
      if (focused) focused.classList.remove('card-focused');
      focused = card; card.classList.add('card-focused');
      overlay.style.clipPath = '';
      overlay.classList.add('active'); focusBorder.classList.add('active');
      cancelAnimationFrame(raf); setTimeout(update, 20);
      clearTimeout(timer); timer = setTimeout(unfocus, 4000);
    }
    function unfocus() {
      cancelAnimationFrame(raf); clearTimeout(timer);
      if (focused) { focused.classList.remove('card-focused'); focused = null; }
      overlay.style.clipPath = ''; overlay.classList.remove('active'); focusBorder.classList.remove('active');
    }
    document.addEventListener('click', function (e) {
      if (e.target === overlay) { unfocus(); return; }
      if (e.target.closest('.gallery-wrap, #lightbox, .exp-carousel, .exp-hero, .video-wrap, button, input, select, textarea, label, .contact-float-panel, .menu-lateral')) { if (focused) unfocus(); return; }
      var link = e.target.closest('a[href]');
      if (link && link.getAttribute('href').charAt(0) !== '#') { unfocus(); return; }
      var card = e.target.closest(CARD_SEL);
      if (!card) { if (focused) unfocus(); return; }
      focus(card);
    });
    window.addEventListener('scroll', function () { if (focused) unfocus(); }, { passive: true });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') unfocus(); });
  })();

  /* ════════════════════════════════════════
     NAV BLOB LÍQUIDO — viaja desde la página anterior
     ════════════════════════════════════════ */
  (function () {
    var wrap = document.querySelector('.nav-btns');
    var blob = document.getElementById('blob');
    if (!blob || !wrap) return;
    var btns = Array.prototype.slice.call(wrap.querySelectorAll('.nav-btn'));
    var KEY = 'navBlobLastIndex';
    var lastLeft = 0;

    function offset(b) { var r = b.getBoundingClientRect(), w = wrap.getBoundingClientRect(); return { left: r.left - w.left, width: r.width }; }
    function setInstant(p) {
      blob.style.transition = 'none';
      blob.style.width = p.width + 'px'; blob.style.left = p.left + 'px'; blob.style.transform = 'scaleX(1)';
      void blob.offsetHeight; blob.style.transition = ''; lastLeft = p.left;
    }
    function moveTo(b) {
      var p = offset(b);
      if (reduceMotion) { setInstant(p); return; }
      blob.style.transformOrigin = p.left > lastLeft ? 'left center' : 'right center';
      blob.style.transition = 'transform 0.6s cubic-bezier(0.42,0,0.58,1), left 0.6s cubic-bezier(0.42,0,0.58,1), width 0.3s ease';
      blob.style.transform = 'scaleX(2.8)';
      setTimeout(function () {
        blob.style.transition = 'transform 0.9s cubic-bezier(0.25,1,0.5,1), left 0.7s cubic-bezier(0.25,1,0.5,1), width 0.3s ease';
        blob.style.width = p.width + 'px'; blob.style.left = p.left + 'px'; blob.style.transform = 'scaleX(1)';
      }, 400);
      lastLeft = p.left;
    }
    function ripple(e, b) {
      var c = document.createElement('span'), r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
      c.className = 'ripple';
      c.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
      b.appendChild(c); c.addEventListener('animationend', function () { c.remove(); });
    }
    function activate(b) { btns.forEach(function (x) { x.classList.toggle('active', x === b); x.removeAttribute('aria-current'); }); b.setAttribute('aria-current', 'page'); }

    btns.forEach(function (b) {
      b.addEventListener('click', function (e) {
        ripple(e, b);
        var href = b.getAttribute('href') || '';
        var hash = href.indexOf('#') > -1 ? href.slice(href.indexOf('#')) : '';
        var samePage = hash && (href.charAt(0) === '#' || b.pathname === location.pathname);
        if (samePage) {
          var dest = document.querySelector(hash);
          if (dest) { e.preventDefault(); activate(b); moveTo(b); scrollToEl(dest); history.replaceState(null, '', hash); }
          return;
        }
        var origin = wrap.querySelector('.nav-btn.active');
        try { sessionStorage.setItem(KEY, JSON.stringify({ index: origin ? btns.indexOf(origin) : 0, ts: Date.now() })); } catch (err) {}
      });
    });

    function init() {
      if (location.hash === '#contacto') {
        var c = btns.filter(function (b) { return (b.getAttribute('href') || '').indexOf('#contacto') > -1; })[0];
        if (c && document.getElementById('contacto') && wrap.getAttribute('data-page') === 'inicio') activate(c);
      }
      var active = wrap.querySelector('.nav-btn.active') || btns[0];
      var last = null;
      try {
        var s = JSON.parse(sessionStorage.getItem(KEY) || 'null');
        if (s && Date.now() - s.ts < 4000) last = s.index;
        sessionStorage.removeItem(KEY);
      } catch (err) {}
      if (last !== null && btns[last] && btns[last] !== active) {
        setInstant(offset(btns[last]));
        requestAnimationFrame(function () { moveTo(active); });
      } else setInstant(offset(active));
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(init); });
    else requestAnimationFrame(init);
    window.addEventListener('resize', function () { var a = wrap.querySelector('.nav-btn.active'); if (a) setInstant(offset(a)); });
  })();

  /* ── Scroll suave con compensación de la barra fija ── */
  function scrollToEl(el) {
    var top = el.getBoundingClientRect().top + window.scrollY - (window.innerWidth <= 768 ? 76 : 96);
    window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('nav-btn') || a.classList.contains('skip-link')) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var t = document.querySelector(id);
    if (t) { e.preventDefault(); scrollToEl(t); }
  });
  if (location.hash && location.hash.length > 1) {
    window.addEventListener('load', function () {
      var t = document.querySelector(location.hash);
      if (t) setTimeout(function () { scrollToEl(t); }, 60);
    });
  }

  /* ════════════════════════════════════════
     MENÚ MÓVIL Y PANEL DE CONTACTO (checkbox + teclado)
     ════════════════════════════════════════ */
  (function () {
    var menu = document.getElementById('menu-toggle');
    var contact = document.getElementById('contact-float-toggle');

    /* Las <label> que abren/cierran funcionan con Enter y Espacio */
    document.querySelectorAll('label[role="button"]').forEach(function (l) {
      l.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); l.click(); }
      });
    });
    function sync() {
      var burger = document.querySelector('.toggle-hamburguesa');
      if (burger && menu) burger.setAttribute('aria-expanded', menu.checked ? 'true' : 'false');
      document.querySelectorAll('[for="contact-float-toggle"][aria-expanded]').forEach(function (l) { l.setAttribute('aria-expanded', contact && contact.checked ? 'true' : 'false'); });
      var panel = document.querySelector('.contact-float-panel');
      if (panel) panel.setAttribute('aria-hidden', contact && contact.checked ? 'false' : 'true');
      var lateral = document.querySelector('.menu-lateral');
      if (lateral) lateral.setAttribute('aria-hidden', menu && menu.checked ? 'false' : 'true');
      document.body.style.overflow = (menu && menu.checked) ? 'hidden' : '';
    }
    if (menu) menu.addEventListener('change', function () {
      sync();
      if (menu.checked) { var f = document.querySelector('.menu-lateral-close'); if (f) setTimeout(function () { f.focus(); }, 200); }
    });
    if (contact) contact.addEventListener('change', function () {
      sync();
      if (contact.checked) { var c = document.querySelector('.contact-float-close'); if (c) setTimeout(function () { c.focus(); }, 300); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (menu && menu.checked) { menu.checked = false; sync(); var b = document.querySelector('.toggle-hamburguesa'); if (b) b.focus(); }
      if (contact && contact.checked) { contact.checked = false; sync(); var t = document.querySelector('.contact-float-trigger'); if (t) t.focus(); }
    });
    document.querySelectorAll('.menu-lateral a, .contact-float-panel a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (menu) menu.checked = false;
        if (contact) contact.checked = false;
        sync();
      });
    });
    sync();
  })();

  /* ── Botón "Arriba" ── */
  document.querySelectorAll('.footer-top-btn, #back-top-proyecto').forEach(function (b) {
    b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
  });
  var backTop = document.getElementById('back-top-proyecto');
  if (backTop) window.addEventListener('scroll', function () { backTop.classList.toggle('visible', window.scrollY > 500); }, { passive: true });

  /* ════════════════════════════════════════
     SOBRE MÍ — barras de nivel, arrastre horizontal, timeline
     ════════════════════════════════════════ */
  (function () {
    var b4 = document.querySelector('.b-4');
    if (!b4) return;
    function fill() { document.querySelectorAll('.skill-bar-fill').forEach(function (b) { b.style.width = (b.getAttribute('data-width') || 0) + '%'; }); }
    if ('IntersectionObserver' in window) {
      var o = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { fill(); o.disconnect(); } }, { threshold: 0.3 });
      o.observe(b4);
    } else fill();
  })();
  (function () {
    var track = document.getElementById('approachTrack');
    if (!track) return;
    var wrap = track.parentElement, down = false, startX = 0, sl = 0, moved = false;
    wrap.addEventListener('mousedown', function (e) { down = true; moved = false; startX = e.pageX; sl = wrap.scrollLeft; wrap.style.scrollSnapType = 'none'; });
    document.addEventListener('mouseup', function () { if (down) { down = false; wrap.style.scrollSnapType = ''; } });
    wrap.addEventListener('mousemove', function (e) {
      if (!down) return; e.preventDefault();
      var dx = (e.pageX - startX) * 1.4; if (Math.abs(dx) > 4) moved = true;
      wrap.scrollLeft = sl - dx;
    });
    wrap.addEventListener('click', function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
  })();
  (function () {
    var items = document.querySelectorAll('.timeline--about .timeline-item');
    if (!items.length || !finePointer) return;
    items.forEach(function (it) {
      it.addEventListener('mouseenter', function () { items.forEach(function (i) { i.style.opacity = i === it ? '1' : '0.4'; }); });
      it.addEventListener('mouseleave', function () { items.forEach(function (i) { i.style.opacity = ''; }); });
    });
  })();

  /* ════════════════════════════════════════
     GALERÍAS + LIGHTBOX
     ════════════════════════════════════════ */
  (function () {
    var wraps = Array.prototype.slice.call(document.querySelectorAll('.gallery-wrap'));
    if (!wraps.length) return;

    var lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Galería en pantalla completa');
    lb.innerHTML =
      '<button id="lightbox-close" type="button" aria-label="Cerrar galería">' + icon('x-lg') + '</button>' +
      '<button class="lightbox-arrow prev" id="lightbox-prev" type="button" aria-label="Imagen anterior">' + icon('chevron-left') + '</button>' +
      '<button class="lightbox-arrow next" id="lightbox-next" type="button" aria-label="Imagen siguiente">' + icon('chevron-right') + '</button>' +
      '<div class="lightbox-stage"><img id="lightbox-img" alt=""></div>' +
      '<div class="lightbox-footer"><span id="lightbox-counter"></span><div id="lightbox-dots"></div></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('#lightbox-img'), lbCounter = lb.querySelector('#lightbox-counter'), lbDots = lb.querySelector('#lightbox-dots');
    var lbPrev = lb.querySelector('#lightbox-prev'), lbNext = lb.querySelector('#lightbox-next'), lbClose = lb.querySelector('#lightbox-close');
    var lbGallery = null, lbIndex = 0, lastFocus = null;

    function lbRender() {
      var total = lbGallery.images.length, multi = total > 1;
      lbImg.classList.remove('fade-in'); void lbImg.offsetWidth; lbImg.classList.add('fade-in');
      lbImg.src = lbGallery.images[lbIndex];
      lbImg.alt = lbGallery.alt + ' — vista ' + (lbIndex + 1);
      lbCounter.textContent = (lbIndex + 1) + ' / ' + total;
      lbPrev.hidden = !multi; lbNext.hidden = !multi;
      lbDots.innerHTML = '';
      if (multi && total <= 12) lbGallery.images.forEach(function (_, i) {
        var d = document.createElement('button');
        d.type = 'button'; d.className = 'lightbox-dot' + (i === lbIndex ? ' active' : '');
        d.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
        d.addEventListener('click', function () { lbGoTo(i); });
        lbDots.appendChild(d);
      });
      if (multi) [(lbIndex + 1) % total, (lbIndex - 1 + total) % total].forEach(function (i) { new Image().src = lbGallery.images[i]; });
    }
    function lbGoTo(i) { var t = lbGallery.images.length; lbIndex = ((i % t) + t) % t; lbRender(); lbGallery.goTo(lbIndex, true); }
    function openLb(g, i) { lastFocus = document.activeElement; lbGallery = g; lbIndex = i; lbRender(); lb.classList.add('open'); document.body.style.overflow = 'hidden'; lbClose.focus(); }
    function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; lbGallery = null; if (lastFocus) lastFocus.focus(); }
    lbClose.addEventListener('click', closeLb);
    lbPrev.addEventListener('click', function () { lbGoTo(lbIndex - 1); });
    lbNext.addEventListener('click', function () { lbGoTo(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lightbox-stage')) closeLb(); });
    window.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') { e.preventDefault(); lbGoTo(lbIndex - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); lbGoTo(lbIndex + 1); }
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 48) lbGoTo(dx < 0 ? lbIndex + 1 : lbIndex - 1); sx = null; }, { passive: true });

    wraps.forEach(function (wrap) {
      var main = wrap.querySelector('.gallery-main'), img = main && main.querySelector('img');
      if (!img) return;
      var thumbs = Array.prototype.slice.call(wrap.querySelectorAll('.gallery-thumbs button'));
      var images = thumbs.length ? thumbs.map(function (b) { return b.getAttribute('data-src'); }) : [img.getAttribute('src')];
      var blur = document.createElement('div'); blur.className = 'gallery-blur'; main.insertBefore(blur, main.firstChild);
      var counter = wrap.querySelector('.gallery-counter'), current = 0;
      var g = {
        images: images, alt: img.getAttribute('alt') || '',
        goTo: function (i, silent) {
          current = ((i % images.length) + images.length) % images.length;
          if (!silent) { img.classList.remove('fade-in'); void img.offsetWidth; img.classList.add('fade-in'); }
          img.src = images[current];
          blur.style.backgroundImage = 'url("' + img.currentSrc + '")';
          if (counter) counter.textContent = (current + 1) + ' / ' + images.length;
          thumbs.forEach(function (b, k) { b.classList.toggle('active', k === current); b.setAttribute('aria-pressed', k === current ? 'true' : 'false'); });
          if (images.length > 1) new Image().src = images[(current + 1) % images.length];
        }
      };
      img.addEventListener('load', function () { blur.style.backgroundImage = 'url("' + img.currentSrc + '")'; });
      thumbs.forEach(function (b, i) { b.addEventListener('click', function (e) { e.preventDefault(); g.goTo(i); }); });
      var prev = wrap.querySelector('.gallery-arrow.prev'), next = wrap.querySelector('.gallery-arrow.next');
      if (prev) prev.addEventListener('click', function () { g.goTo(current - 1); });
      if (next) next.addEventListener('click', function () { g.goTo(current + 1); });
      var exp = wrap.querySelector('.gallery-expand');
      if (exp) exp.addEventListener('click', function () { openLb(g, current); });
      img.addEventListener('click', function () { openLb(g, current); });
      var hovering = false;
      wrap.addEventListener('mouseenter', function () { hovering = true; });
      wrap.addEventListener('mouseleave', function () { hovering = false; });
      window.addEventListener('keydown', function (e) {
        if (!hovering || lb.classList.contains('open') || images.length < 2) return;
        if (e.key === 'ArrowLeft') g.goTo(current - 1);
        if (e.key === 'ArrowRight') g.goTo(current + 1);
      });
      var tx = null;
      main.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
      main.addEventListener('touchend', function (e) { if (tx === null || images.length < 2) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 48) g.goTo(dx < 0 ? current + 1 : current - 1); tx = null; }, { passive: true });
      g.goTo(0, true);
    });
  })();

  /* ── Copiar enlace del proyecto ── */
  (function () {
    var btn = document.getElementById('copy-link-btn');
    if (!btn) return;
    function toast(msg) {
      var t = document.getElementById('toast-proyecto');
      if (!t) { t = document.createElement('div'); t.id = 'toast-proyecto'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
      t.innerHTML = icon('check-circle-fill') + '<span>' + msg + '</span>';
      t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2600);
    }
    btn.addEventListener('click', function () {
      var url = location.href.split('#')[0];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { toast('Enlace copiado'); }, function () { toast(url); });
      } else toast(url);
    });
  })();

  /* ── Contador animado de cifras (respeta "+" y "%") ── */
  (function () {
    var els = document.querySelectorAll('.stats-strip [data-count]');
    if (!els.length) return;
    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10), suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target) || reduceMotion || target === 0) return;
      var start = performance.now(), dur = 1300;
      (function step(now) {
        var p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    }
    if (!('IntersectionObserver' in window)) return;
    var o = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { run(e.target); o.unobserve(e.target); } }); }, { threshold: 0.5 });
    els.forEach(function (el) { o.observe(el); });
  })();

  /* ── Video demo: portada con botón de play ── */
  document.querySelectorAll('.video-wrap').forEach(function (wrap) {
    var vid = wrap.querySelector('video'), ov = wrap.querySelector('.video-overlay');
    if (!vid || !ov) return;
    function play() { ov.classList.add('hidden'); var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
    ov.addEventListener('click', play);
    ov.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
    vid.addEventListener('play', function () { ov.classList.add('hidden'); });
    vid.addEventListener('ended', function () { ov.classList.remove('hidden'); });
  });

  /* ════════════════════════════════════════
     LÍNEA DE TIEMPO CON BLOB ("Cómo se construyó")
     ════════════════════════════════════════ */
  function initTimeline(tl) {
    if (tl.dataset.tlInit) return;
    var items = Array.prototype.slice.call(tl.querySelectorAll('.timeline-item'));
    if (!items.length) return;
    tl.dataset.tlInit = '1';
    var line = document.createElement('div'); line.className = 'timeline-progress-line'; tl.appendChild(line);
    var blob = document.createElement('div'); blob.className = 'timeline-blob';
    blob.innerHTML = '<svg viewBox="0 0 24 30" aria-hidden="true"><path class="blob-fill" d="M12,2 C17,1 22,5 22,12 C22,18 18,26 12,28 C6,26 2,18 2,12 C2,5 7,3 12,2Z"/></svg>';
    tl.appendChild(blob);
    var active = 0;
    function centerOf(i) { var d = items[i].querySelector('.timeline-dot'); return items[i].offsetTop + (d ? d.offsetTop : 0) + 10; }
    function set(i) {
      active = i;
      items.forEach(function (it, k) { it.classList.toggle('is-active', k === i); });
      var c = centerOf(i);
      blob.style.top = Math.max(0, c - blob.offsetHeight / 2) + 'px';
      var h = tl.scrollHeight;
      line.style.height = (h ? Math.min(100, (c / h) * 100) : 0) + '%';
    }
    items.forEach(function (it, i) { it.addEventListener('click', function () { set(i); }); });
    window.addEventListener('scroll', function () {
      if (tl.offsetParent === null) return;
      var rel = innerHeight / 2 - tl.getBoundingClientRect().top, best = 0, min = Infinity;
      items.forEach(function (_, i) { var d = Math.abs(centerOf(i) - rel); if (d < min) { min = d; best = i; } });
      if (best !== active) set(best);
    }, { passive: true });
    set(0);
    if ('ResizeObserver' in window) new ResizeObserver(function () { if (tl.offsetParent !== null) set(active); }).observe(tl);
  }
  document.querySelectorAll('.timeline--blob').forEach(initTimeline);

  /* ════════════════════════════════════════
     CARRUSEL DE EXPERIMENTOS
     ════════════════════════════════════════ */
  (function () {
    var hero = document.getElementById('exp-hero');
    if (!hero) return;
    var bgs = hero.querySelectorAll('.exp-hero-bg'), infos = hero.querySelectorAll('.exp-info-block'), cards = Array.prototype.slice.call(hero.querySelectorAll('.exp-card'));
    var counter = document.getElementById('exp-counter-current'), bar = document.getElementById('exp-progress-bar');
    var total = cards.length, current = 0;
    if (!total) return;
    function dist(i, a) { var d = i - a; if (d > total / 2) d -= total; if (d < -total / 2) d += total; return d; }
    function go(i) {
      current = ((i % total) + total) % total;
      bgs.forEach(function (b) { b.classList.toggle('is-active', +b.dataset.index === current); });
      infos.forEach(function (b) { var on = +b.dataset.index === current; b.classList.toggle('is-active', on); b.setAttribute('aria-hidden', on ? 'false' : 'true'); b.querySelectorAll('button, a').forEach(function (x) { x.tabIndex = on ? 0 : -1; }); });
      if (counter) counter.textContent = String(current + 1).padStart(2, '0');
      if (bar) bar.style.width = ((current + 1) / total * 100) + '%';
      var target = infos[current] && infos[current].querySelector('.exp-ver-detalle');
      var id = target && target.getAttribute('data-target');
      document.querySelectorAll('.exp-detalle').forEach(function (d) { d.classList.toggle('is-hidden', d.id !== id); });
      document.querySelectorAll('.exp-detalle:not(.is-hidden) .timeline--blob').forEach(initTimeline);
      cards.forEach(function (c, k) {
        var d = dist(k, current), a = Math.abs(d);
        c.classList.toggle('is-active', d === 0);
        c.setAttribute('aria-pressed', d === 0 ? 'true' : 'false');
        if (a > 2) { c.style.opacity = '0'; c.style.zIndex = '0'; c.style.pointerEvents = 'none'; c.tabIndex = -1; return; }
        c.style.transform = 'translateX(' + (d * 48) + 'px) scale(' + (1 - a * 0.1) + ')';
        c.style.zIndex = String(10 - a); c.style.opacity = String(1 - a * 0.28); c.style.pointerEvents = 'auto'; c.tabIndex = 0;
      });
    }
    cards.forEach(function (c, i) { c.addEventListener('click', function () { go(i); }); });
    var prev = document.getElementById('exp-prev'), next = document.getElementById('exp-next');
    if (prev) prev.addEventListener('click', function () { go(current - 1); });
    if (next) next.addEventListener('click', function () { go(current + 1); });
    hero.querySelectorAll('.exp-ver-detalle').forEach(function (b) {
      b.addEventListener('click', function () { var t = document.getElementById(b.getAttribute('data-target')); if (t) scrollToEl(t); });
    });
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(current - 1);
      if (e.key === 'ArrowRight') go(current + 1);
    });
    var sx = null;
    hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 56) go(dx < 0 ? current + 1 : current - 1); sx = null; }, { passive: true });
    var start = parseInt((location.hash.match(/^#exp-(\d+)$/) || [])[1], 10);
    go(isNaN(start) ? 0 : start - 1);
  })();
})();
