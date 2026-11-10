/* ALTO · stickers Y2K pegados en la web (decorativos).
   Para quitar uno, borrá su línea en LISTA. Para sacarlos todos, no cargues este archivo. */
(function () {
  var cur = document.currentScript, src = (cur && cur.src) || '';
  var BASE = /\/assets\/js\//.test(src) ? src.replace(/\/assets\/js\/.*$/, '/assets/img/') : '';
  // [dónde (selector), imagen, ancho px, giro, posición]
  var LISTA = [
    ['.launch', 'stk-nubi.webp', 150, 8, 'top:-58px;right:10px'],
    ['#catalogo h2', 'stk-plane.webp', 110, -10, 'top:-30px;right:-130px'],
    ['#torre h2', 'stk-piso.webp', 96, 12, 'top:-24px;right:-110px'],
    ['#dudas h2', 'stk-boton.webp', 82, -8, 'top:-74px;right:24px']
  ];
  LISTA.forEach(function (s) {
    var el = document.querySelector(s[0]); if (!el) return;
    var host = el.tagName === 'H2' ? el : el;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var img = document.createElement('img');
    img.src = BASE + s[1]; img.alt = ''; img.setAttribute('aria-hidden', 'true'); img.className = 'y2k-stk'; img.loading = 'lazy';
    img.style.cssText = 'width:' + s[2] + 'px;' + s[4] + ';--r:' + s[3] + 'deg';
    host.appendChild(img);
  });
  // Nubi en el botón del chat (si no carga la imagen, queda el ícono de siempre)
  function nubiFab() {
    var fab = document.querySelector('.aa-fab'); if (!fab) return false;
    if (fab.querySelector('.aa-nubi')) return true;
    var im = new Image(); im.className = 'aa-nubi'; im.alt = ''; im.setAttribute('aria-hidden', 'true');
    im.onload = function () { fab.classList.add('has-nubi'); fab.appendChild(im); };
    im.src = BASE + 'stk-nubiface.webp';
    return true;
  }
  if (!nubiFab()) { var n = 0, t = setInterval(function () { if (nubiFab() || ++n > 40) clearInterval(t); }, 250); }
  // Sol de la portada: ilustración estilo años 30 (si no carga, queda la animación de siempre)
  function solFlat() {
    var disc = document.querySelector('.sun__disc'); if (!disc) return false;
    if (disc.querySelector('.sun-flat')) return true;
    var im = new Image(); im.className = 'sun-flat'; im.alt = ''; im.setAttribute('aria-hidden', 'true');
    im.onload = function () { disc.classList.add('has-flat'); disc.appendChild(im); };
    im.src = BASE + 'sol-alto.svg';
    return true;
  }
  if (!solFlat()) { var k = 0, t2 = setInterval(function () { if (solFlat() || ++k > 40) clearInterval(t2); }, 250); }
  // menú del celular: al tocar un link, se cierra y baja a la sección
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.is-menu-open a[href*="#"]'); if (!a) return;
    var c = document.querySelector('.is-menu-open .wp-block-navigation__responsive-container-close'); if (c) c.click();
  });
  // menú del celular (versión sin WordPress): botón ≡ + pantalla completa
  (function () {
    var nav = document.querySelector('.top__nav'), top = document.querySelector('.top'); if (!nav || !top) return;
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'top__burger'; btn.setAttribute('aria-label', 'Abrir menú'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<i></i><i></i>'; top.insertBefore(btn, nav.nextSibling);
    var ov = document.createElement('div'); ov.className = 'mnav'; ov.hidden = true; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Menú');
    ov.innerHTML = '<button type="button" class="mnav__x" aria-label="Cerrar menú">×</button><nav class="mnav__list">' +
      [].map.call(nav.querySelectorAll('a'), function (a, i) { return '<a href="' + a.getAttribute('href') + '"><small>0' + (i + 1) + '</small>' + a.textContent + '</a>'; }).join('') +
      '</nav><p class="mnav__foot">Alto nivel para marcas que van alto.</p>';
    document.body.appendChild(ov);
    function open() { ov.hidden = false; document.documentElement.classList.add('has-modal-open'); btn.setAttribute('aria-expanded', 'true'); setTimeout(function () { ov.querySelector('a').focus(); }, 50); }
    function close() { ov.hidden = true; document.documentElement.classList.remove('has-modal-open'); btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', open);
    ov.querySelector('.mnav__x').addEventListener('click', close);
    ov.addEventListener('click', function (e) { var a = e.target.closest('a'); if (!a) return; close(); var nl = document.querySelector('.top__nav a[href="' + a.getAttribute('href') + '"]'); if (nl) { e.preventDefault(); nl.click(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ov.hidden) close(); });
  })();
})();
