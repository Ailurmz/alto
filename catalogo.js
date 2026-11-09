/* ALTO · catálogo de demos (se carga antes de main.js). Los datos están en data.js → demos y tiposDemo */
(function () {
  var DATA = window.ALTO || {}, C = DATA.contacto || {};
  var grid = document.getElementById('catGrid'), tabs = document.getElementById('catTabs'), meta = document.getElementById('catMeta');
  if (!grid || !tabs) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var wa = function (m) { return 'https://wa.me/' + (C.whatsapp || '') + '?text=' + encodeURIComponent(m); };
  var T = DATA.tiposDemo || {}, demos = DATA.demos || [], order = ['landing', 'web', 'empresa'];

  // tarjetas: se renderizan todas una vez y el filtro solo las muestra u oculta
  demos.forEach(function (d) {
    var el = document.createElement('article'); el.className = 'dcard'; el.setAttribute('data-tipo', d.tipo);
    var link = d.slug ? 'demo-' + d.slug + '.html' : '';
    el.innerHTML = '<a class="dcard__shot" href="' + esc(link) + '" target="_blank" rel="noopener" aria-label="Ver la demo ' + esc(d.nombre) + '">' +
      '<span class="dcard__bar"><i></i><i></i><i></i></span><img src="cat-' + esc(d.slug) + '.webp" alt="Demo ' + esc(d.nombre) + '" loading="lazy" width="720" height="450"></a>' +
      '<div class="dcard__body"><span class="mono dcard__rubro">' + esc(d.rubro) + '</span><h3>' + esc(d.nombre) + '</h3>' +
      '<div class="dcard__btns"><a class="btn btn--ghost btn--sm magnet" href="' + esc(link) + '" target="_blank" rel="noopener" data-hover="Mirala"><span>Ver demo</span></a>' +
      '<a class="btn btn--blue btn--sm magnet" href="' + esc(wa('Hola ALTO, me gustó la demo ' + d.nombre + ' (' + (T[d.tipo] ? T[d.tipo].nombre : d.tipo) + '). ¿Me cuentan cómo sigo?')) + '" target="_blank" rel="noopener" data-hover="¡Vamos!"><span>Quiero esta</span></a></div></div>';
    grid.appendChild(el);
  });

  function show(tipo) {
    [].forEach.call(tabs.children, function (b) { var on = b.getAttribute('data-tipo') === tipo; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
    [].forEach.call(grid.children, function (c) { c.hidden = c.getAttribute('data-tipo') !== tipo; });
    var t = T[tipo] || {};
    meta.innerHTML = esc(t.bajada || '') + (t.desde ? ' <span class="cat__from">desde <b>' + esc(t.desde) + '</b> USD</span>' : '') + (t.plazo ? ' <span class="cat__time">' + esc(t.plazo) + '</span>' : '');
    if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 50);
  }
  order.forEach(function (k) {
    if (!T[k]) return;
    var n = demos.filter(function (d) { return d.tipo === k; }).length;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'cat__tab'; b.setAttribute('role', 'tab'); b.setAttribute('data-tipo', k);
    b.innerHTML = esc(T[k].nombre) + ' <small>' + n + '</small>'; b.addEventListener('click', function () { show(k); });
    tabs.appendChild(b);
  });
  show('landing');

  // las tarjetas "desde" de Precios abren la pestaña que corresponde
  [].forEach.call(document.querySelectorAll('[data-cat]'), function (a) { a.addEventListener('click', function () { show(a.getAttribute('data-cat')); }); });

  // el formulario de contacto también ofrece las demos
  var sel = document.getElementById('fPaquete');
  if (sel) {
    var g = document.createElement('optgroup'); g.label = 'Una de las demos';
    demos.forEach(function (d) { var o = document.createElement('option'); o.value = 'un diseño como la demo ' + d.nombre; o.textContent = d.nombre + ' · ' + d.rubro; g.appendChild(o); });
    sel.appendChild(g);
  }
})();
