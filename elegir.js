/* =========================================================
   ALTO · "Elegir esta": al elegir una plantilla, el cliente decide quién la arma.
   Funciona con cualquier botón/link que tenga la clase "is-pick" o href="#elegir"
   dentro de una tarjeta de plantilla (.dcard). Lee el nombre de la tarjeta.
   ========================================================= */
(function () {
  var WA = (window.ALTO && window.ALTO.contacto && window.ALTO.contacto.whatsapp) || '5491140585229';
  var PRECIO = { pro: '80', esencial: '60', armamos: '120' };
  var wa = function (m) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(m); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var m = document.createElement('div'); m.className = 'pk'; m.hidden = true; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'pkT');
  document.body.appendChild(m);
  var last = null;
  function close() { m.classList.remove('is-on'); document.documentElement.classList.remove('ag-lock'); setTimeout(function () { m.hidden = true; if (last && last.focus) last.focus(); }, 300); }
  function open(nombre, pro, rubro) {
    last = document.activeElement;
    var p = pro ? PRECIO.pro : PRECIO.esencial;
    m.innerHTML = '<div class="pk__back" data-close></div><div class="pk__box">' +
      '<button class="pk__x" type="button" aria-label="Cerrar" data-close>×</button>' +
      '<span class="pk__k">Elegiste ' + (pro ? '★ Pro' : 'Esencial') + '</span>' +
      '<h3 id="pkT">' + esc(nombre) + '. ¿Quién la arma?</h3>' +
      '<p class="pk__lead">Es el mismo diseño. La diferencia es quién lo adapta a tu negocio.</p>' +
      '<div class="pk__opts">' +
      ' <a class="pk__o" href="' + wa('Hola ALTO, quiero descargar la plantilla ' + nombre + ' (' + p + ' USD) para editarla yo.') + '" target="_blank" rel="noopener">' +
      '  <span class="pk__ic">⬇</span><span class="pk__t"><b>La armo yo</b><small>Plantilla para descargar. La editás vos en WordPress, con guía en PDF.</small></span><em>' + p + ' <small>USD</small></em></a>' +
      ' <a class="pk__o is-top" href="' + wa('Hola ALTO, quiero que me armen la plantilla ' + nombre + ' con mi marca (online en 72 h). ¿Coordinamos una llamada?') + '" target="_blank" rel="noopener">' +
      '  <span class="pk__flag">Más elegida</span><span class="pk__ic">⭐</span><span class="pk__t"><b>Me la arman ustedes</b><small>Con tu logo, colores, textos y fotos. Online en 72 h. Arrancamos con una videollamada para entender lo que querés.</small></span><em><small>desde</small> ' + PRECIO.armamos + ' <small>USD</small></em></a>' +
      '</div>' +
      '<p class="pk__foot">¿Querés algo que nadie más tenga? <a href="#paquetes" data-close>Mirá el diseño único, a medida →</a></p>' +
      '</div>';
    m.hidden = false; document.documentElement.classList.add('ag-lock');
    requestAnimationFrame(function () { m.classList.add('is-on'); });
    setTimeout(function () { var o = m.querySelector('.pk__o.is-top'); if (o) o.focus(); }, 300);
    try { if (window.gtag) gtag('event', 'plantilla_elegida', { plantilla: nombre }); } catch (e) {}
  }
  m.addEventListener('click', function (e) {
    var c = e.target.closest('[data-close]'); if (!c) return;
    close();
    if (c.tagName === 'A') { e.preventDefault(); var nav = document.querySelector('.top__nav a[href="#paquetes"], .alto-nav a[href="#paquetes"]'); if (nav) nav.click(); else document.getElementById('paquetes').scrollIntoView({ behavior: 'smooth' }); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) close(); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.is-pick, a[href="#elegir"]'); if (!b) return;
    var card = b.closest('.dcard'); if (!card) return;
    e.preventDefault();
    var h = card.querySelector('h3, .dcard-name'); var nombre = h ? h.textContent.trim() : 'esta plantilla';
    open(nombre, card.classList.contains('dcard--big'));
  });
})();
