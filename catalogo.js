/* ALTO · Plantillas ALTO: Pro y Esenciales (se carga antes de main.js). Datos en data.js → niveles, destacadas y demos */
(function () {
  var DATA = window.ALTO || {}, C = DATA.contacto || {};
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var wa = function (m) { return 'https://wa.me/' + (C.whatsapp || '') + '?text=' + encodeURIComponent(m); };
  var T = DATA.tiposDemo || {}, demos = DATA.demos || [], NV = DATA.niveles || {};
  var TIPO = { landing: 'Landing', web: 'Web', empresa: 'Empresa' };

  // tarjeta de plantilla (nivel "pro" o "esencial")
  function card(d, nivel) {
    var n = NV[nivel] || {}, pro = nivel === 'pro', soon = d.estado === 'pronto';
    var el = document.createElement('article'); el.className = 'dcard' + (pro ? ' dcard--big' : '') + (soon ? ' is-soon' : '');
    var link = 'demo-' + d.slug + '.html';
    var shot = soon
      ? '<div class="dcard__shot dcard__art" style="--a:' + esc(d.color || '#2B3BFF') + ';--b:' + esc(d.color2 || '#FFC53D') + '"><span class="dcard__bar"><i></i><i></i><i></i></span><b>' + esc(d.nombre) + '</b><em>Muy pronto</em></div>'
      : '<a class="dcard__shot" href="' + esc(link) + '" target="_blank" rel="noopener" aria-label="Ver la demo ' + esc(d.nombre) + '"><span class="dcard__bar"><i></i><i></i><i></i></span><img src="cat-' + esc(d.slug) + '.webp" alt="Plantilla ' + esc(d.nombre) + '" loading="lazy" width="720" height="450"></a>';
    var btns = soon
      ? '<a class="btn btn--ghost btn--sm magnet" href="' + esc(wa('Hola ALTO, avisame cuando esté lista la plantilla ' + d.nombre + ' (' + d.rubro + ').')) + '" target="_blank" rel="noopener" data-hover="Te avisamos"><span>Avisame cuando esté</span></a>'
      : '<a class="btn btn--ghost btn--sm magnet" href="' + esc(link) + '" target="_blank" rel="noopener" data-hover="Mirala"><span>Ver demo</span></a>' +
        '<a class="btn btn--blue btn--sm magnet is-pick" href="#elegir" data-hover="¡Esta!"><span>Elegir esta</span></a>';
    var dl = false ? '<a class="dcard__dl" href="' + esc(d.descarga || wa('Hola ALTO, quiero descargar la plantilla ' + d.nombre + ' (' + n.precio + ' USD).')) + '" target="_blank" rel="noopener">⤓ Descargala y editala vos · <b>' + esc(n.precio) + ' USD</b></a>' : '';
    el.innerHTML = shot + '<div class="dcard__body"><span class="mono dcard__rubro">' + (pro ? '★ Pro' : 'Esencial') + ' · ' + esc(TIPO[d.tipo] || '') + ' · ' + esc(d.rubro) + '</span><h3>' + esc(d.nombre) + '</h3>' +
      (pro && d.bajada ? '<p class="dcard__txt">' + esc(d.bajada) + '</p>' : '') + '<div class="dcard__btns">' + btns + '</div>' + dl + '</div>';
    return el;
  }
  var gPro = document.getElementById('catPro'), gEsen = document.getElementById('catEsen'), more = document.getElementById('catMore');
  var VIS = 3, extra = 0;
  if (gPro) (DATA.destacadas || []).forEach(function (d, i) { var c = card(d, 'pro'); if (i >= VIS) { c.hidden = true; c.classList.add('is-more'); extra++; } gPro.appendChild(c); });
  if (gEsen) demos.forEach(function (d, i) { var c = card(d, 'esencial'); if (i >= VIS) { c.hidden = true; c.classList.add('is-more'); extra++; } gEsen.appendChild(c); });
  if (more) {
    if (!extra) more.hidden = true;
    var lab = function (o) { more.innerHTML = o ? '<span>Ver menos</span>' : '<span>Ver todas las plantillas (+' + extra + ')</span>'; };
    lab(false);
    more.addEventListener('click', function () {
      var o = more.classList.toggle('is-open');
      [].forEach.call(document.querySelectorAll('#catPro .is-more, #catEsen .is-more'), function (x) { x.hidden = !o; });
      lab(o); if (!o) document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
      if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 50);
    });
  }
  if (!gPro && !gEsen) return;

  // ---------- Web 72 h, extras, pack y lanzamiento (datos en data.js) ----------
  var $ = function (id) { return document.getElementById(id); };
  var W = DATA.web72 || {}, L = DATA.lanzamiento || {}, DP = DATA.despegue;
  if ($('w72')) (W.planes || []).forEach(function (p) {
    var el = document.createElement('article'); el.className = 'w72__c' + (p.destacado ? ' is-top' : '');
    el.innerHTML = (p.destacado ? '<span class="pack__flag">El más elegido</span>' : '') + '<span class="mono">Plantilla ALTO adaptada a tu marca</span><h3>' + esc(p.nombre) + '</h3><p>' + esc(p.para) + '</p>' +
      
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
    $('launch').innerHTML = '<img class="gift__img" src="kit-despegue.webp" alt="Kit Despegue: planner, organizador y stickers de regalo" width="600" height="400" loading="lazy"><div class="gift__txt"><span class="mono">🎁 Regalo ALTO</span><h3>Con tu web, te llevás el Kit Despegue.</h3><p>Planner de contenido mensual, organizador semanal con checklist de lanzamiento y stickers para imprimir y usar en tus pedidos. Lo descargás apenas publicamos tu web.</p><a class="btn btn--sm btn--dark magnet" href="https://wa.me/5491140585229?text=Hola%20ALTO%2C%20quiero%20mi%20web%20y%20el%20Kit%20Despegue%20de%20regalo." target="_blank" rel="noopener" data-hover="¡Lo quiero!"><span>Quiero mi web con regalo</span></a></div>';
  }

  // el formulario de contacto: se arma ordenado cuando ya cargó todo
  document.addEventListener('DOMContentLoaded', function () {
    var sel = $('fPaquete'); if (!sel) return;
    var keep = sel.querySelector('option[value=""]'); sel.innerHTML = ''; if (keep) sel.appendChild(keep);
    var group = function (label, items) { var g = document.createElement('optgroup'); g.label = label; items.forEach(function (it) { var o = document.createElement('option'); o.value = it[0]; o.textContent = it[1]; g.appendChild(o); }); sel.appendChild(g); };
    group('Web 72 h', (W.planes || []).map(function (p) { return ['la ' + p.nombre, p.nombre + ' · plantilla adaptada a tu marca']; }).concat(DP ? [['el pack ' + DP.nombre, DP.nombre + ': marca + web + 6 publicaciones']] : []));
    group('A medida', (DATA.paquetes || []).map(function (k) { return ['la ' + k.nombre, k.nombre]; }));
    group('Una plantilla del catálogo', demos.map(function (d) { return ['la plantilla ' + d.nombre, d.nombre + ' · ' + d.rubro]; }));
    group('Descargar una plantilla', [['descargar una plantilla Pro (' + ((NV.pro || {}).precio || '') + ' USD)', 'Plantilla Pro para descargar'], ['descargar una plantilla Esencial (' + ((NV.esencial || {}).precio || '') + ' USD)', 'Plantilla Esencial para descargar']]);
    var o = document.createElement('option'); o.value = 'todavía no sé qué necesito'; o.textContent = 'Todavía no sé'; sel.appendChild(o);
  });
})();
