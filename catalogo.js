/* ALTO · catálogo de demos (se carga antes de main.js). Los datos están en data.js → demos y tiposDemo */
(function () {
  var DATA = window.ALTO || {}, C = DATA.contacto || {};
  var grid = document.getElementById('catGrid'), tabs = document.getElementById('catTabs'), meta = document.getElementById('catMeta');
  if (!grid || !tabs) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var wa = function (m) { return 'https://wa.me/' + (C.whatsapp || '') + '?text=' + encodeURIComponent(m); };
  var T = DATA.tiposDemo || {}, demos = DATA.demos || [], order = ['landing', 'web', 'empresa'];

  var DESC = DATA.descarga || {};
  function card(d, big) {
    var el = document.createElement('article'); el.className = 'dcard' + (big ? ' dcard--big' : '') + (d.estado === 'pronto' ? ' is-soon' : '');
    el.setAttribute('data-tipo', d.tipo);
    var link = 'demo-' + d.slug + '.html', tipo = T[d.tipo] ? T[d.tipo].nombre : d.tipo, precio = DESC[d.tipo];
    var shot = d.estado === 'pronto'
      ? '<div class="dcard__shot dcard__art" style="--a:' + esc(d.color || '#2B3BFF') + ';--b:' + esc(d.color2 || '#FFC53D') + '"><span class="dcard__bar"><i></i><i></i><i></i></span><b>' + esc(d.nombre) + '</b><em>Muy pronto</em></div>'
      : '<a class="dcard__shot" href="' + esc(link) + '" target="_blank" rel="noopener" aria-label="Ver la demo ' + esc(d.nombre) + '"><span class="dcard__bar"><i></i><i></i><i></i></span><img src="cat-' + esc(d.slug) + '.webp" alt="Demo ' + esc(d.nombre) + '" loading="lazy" width="720" height="450"></a>';
    var btns = d.estado === 'pronto'
      ? '<a class="btn btn--ghost btn--sm magnet" href="' + esc(wa('Hola ALTO, avisame cuando esté lista la demo ' + d.nombre + ' (' + d.rubro + ').')) + '" target="_blank" rel="noopener" data-hover="Te avisamos"><span>Avisame cuando esté</span></a>'
      : '<a class="btn btn--ghost btn--sm magnet" href="' + esc(link) + '" target="_blank" rel="noopener" data-hover="Mirala"><span>Ver demo</span></a>' +
        '<a class="btn btn--blue btn--sm magnet" href="' + esc(wa('Hola ALTO, me gustó la demo ' + d.nombre + ' (' + tipo + '). Quiero que la adapten a mi marca.')) + '" target="_blank" rel="noopener" data-hover="¡Vamos!"><span>Quiero esta</span></a>';
    var dl = (d.estado !== 'pronto' && precio) ? '<a class="dcard__dl" href="' + esc(d.descarga || wa('Hola ALTO, quiero descargar la plantilla ' + d.nombre + ' (' + precio + ' USD).')) + '" target="_blank" rel="noopener">⤓ Descargala · <b>' + esc(precio) + ' USD</b></a>' : '';
    el.innerHTML = shot + '<div class="dcard__body"><span class="mono dcard__rubro">' + (big ? '★ Destacada · ' : 'Genérica · ') + esc(d.rubro) + '</span><h3>' + esc(d.nombre) + '</h3>' +
      (big && d.bajada ? '<p class="dcard__txt">' + esc(d.bajada) + '</p>' : '') + '<div class="dcard__btns">' + btns + '</div>' + dl + '</div>';
    return el;
  }
  // primera fila: genéricas destacadas
  var fx = document.getElementById('catFeat');
  if (fx) (DATA.destacadas || []).forEach(function (d) { fx.appendChild(card(d, true)); });
  // todas las genéricas, con filtro por tipo
  demos.forEach(function (d) { grid.appendChild(card(d, false)); });

  function show(tipo) {
    [].forEach.call(tabs.children, function (b) { var on = b.getAttribute('data-tipo') === tipo; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
    [].forEach.call(grid.children, function (c) { c.hidden = c.getAttribute('data-tipo') !== tipo; });
    var t = T[tipo] || {};
    meta.innerHTML = esc(t.bajada || '') + (t.plazo ? ' <span class="cat__time">' + esc(t.plazo) + '</span>' : '');
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

  // ---------- Web 72 h, extras, pack y lanzamiento (datos en data.js) ----------
  var $ = function (id) { return document.getElementById(id); };
  var W = DATA.web72 || {}, L = DATA.lanzamiento || {}, DP = DATA.despegue;
  if ($('w72')) (W.planes || []).forEach(function (p) {
    var el = document.createElement('article'); el.className = 'w72__c' + (p.destacado ? ' is-top' : '');
    el.innerHTML = (p.destacado ? '<span class="pack__flag">El más elegido</span>' : '') + '<span class="mono">Genérica adaptada a tu marca</span><h3>' + esc(p.nombre) + '</h3><p>' + esc(p.para) + '</p>' +
      
      '<a class="btn btn--sm magnet ' + (p.destacado ? 'btn--ember' : 'btn--ghost') + '" href="#catalogo" data-cat="' + esc(p.tipo) + '" data-hover="Elegí tu diseño"><span>Elegir diseño</span></a>' +
      '<a class="w72__wa" href="' + esc(wa('Hola ALTO, quiero mi ' + p.nombre + '. ¿Me cuentan cómo sigo?')) + '" target="_blank" rel="noopener">o consultá por WhatsApp →</a>';
    $('w72').appendChild(el);
  });
  if ($('w72inc')) $('w72inc').innerHTML = (W.incluye || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
  if ($('w72note')) $('w72note').textContent = W.nota || '';
  if ($('sumale')) $('sumale').innerHTML = (DATA.sumale || []).map(function (x) {
    return '<li><div><b>' + esc(x.nombre) + '</b><span>' + esc(x.detalle) + '</span></div><em class="add__plus">+</em></li>';
  }).join('');
  if ($('despegue') && DP) {
    $('despegue').innerHTML = '<div class="bundle__txt"><span class="mono">Pack</span><h3>' + esc(DP.nombre) + '</h3><p>' + esc(DP.bajada) + '</p>' +
      '<ul>' + (DP.incluye || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><p class="mono bundle__time">' + esc(DP.plazo) + '</p></div>' +
      '<div class="bundle__cta"><p>Todo junto, con la misma estética y un precio especial por armarlo en un solo paso.</p>' +
      '<a class="btn btn--lg magnet bundle__btn" href="' + esc(wa('Hola ALTO, quiero el pack ' + DP.nombre + ': identidad de marca + web + 6 publicaciones. ¿Me pasan una propuesta?')) + '" target="_blank" rel="noopener" data-hover="¡Despeguemos!"><span>Quiero mi propuesta</span></a></div>';
  }
  if ($('launch') && L.activo) {
    $('launch').hidden = false;
    $('launch').innerHTML = '<span class="launch__dot" aria-hidden="true"></span><p><b>Lanzamiento ALTO.</b> ' + esc(L.texto) + '</p>' +
      '<a class="btn btn--sm btn--dark magnet" href="' + esc(wa('Hola ALTO, quiero uno de los ' + L.lugares + ' lugares de lanzamiento.')) + '" target="_blank" rel="noopener" data-hover="¡Quiero!"><span>Quiero mi lugar</span></a>';
  }
  [].forEach.call(document.querySelectorAll('.w72 [data-cat]'), function (a) { a.addEventListener('click', function () { show(a.getAttribute('data-cat')); }); });

  // el formulario de contacto: se arma ordenado cuando ya cargó todo
  document.addEventListener('DOMContentLoaded', function () {
    var sel = $('fPaquete'); if (!sel) return;
    var keep = sel.querySelector('option[value=""]'); sel.innerHTML = ''; if (keep) sel.appendChild(keep);
    var group = function (label, items) { var g = document.createElement('optgroup'); g.label = label; items.forEach(function (it) { var o = document.createElement('option'); o.value = it[0]; o.textContent = it[1]; g.appendChild(o); }); sel.appendChild(g); };
    group('Web 72 h', (W.planes || []).map(function (p) { return ['la ' + p.nombre, p.nombre + ' · diseño genérico adaptado']; }).concat(DP ? [['el pack ' + DP.nombre, DP.nombre + ': marca + web + 6 publicaciones']] : []));
    group('A medida', (DATA.paquetes || []).map(function (k) { return ['la ' + k.nombre, k.nombre]; }));
    group('Un diseño del catálogo', demos.map(function (d) { return ['un diseño como la demo ' + d.nombre, d.nombre + ' · ' + d.rubro]; }));
    if (!document.getElementById('precios').hidden) group('Hacelo vos', (DATA.plantillas || []).map(function (t) { return ['la plantilla ' + t.nombre, 'Plantilla para descargar: ' + t.nombre]; }));
    var o = document.createElement('option'); o.value = 'todavía no sé qué necesito'; o.textContent = 'Todavía no sé'; sel.appendChild(o);
  });
})();
