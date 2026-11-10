/* =========================================================
   ALTO · Regalo: agenda 2027 (popup a pantalla completa)
   - Se abre sola UNA vez (primera visita). Después, una pestaña al costado la vuelve a abrir.
   - Pide nombre + email o WhatsApp, y cada descarga te llega por email (FormSubmit).
   - Si ya la descargó, pregunta si quiere descargarla de nuevo.
   Para cambiar el email que recibe los avisos, editá AVISOS.
   ========================================================= */
(function () {
  var ACTIVO = true;
  var AVISOS = 'altowebs.agencia@gmail.com';            // ← acá te llegan las descargas
  var DEMORA = 2500;                                      // ms antes de abrirse la primera vez
  if (!ACTIVO) return;
  var cur = document.currentScript, src = (cur && cur.src) || '';
  var BASE = /\/assets\/js\//.test(src) ? src.replace(/\/assets\/js\/.*$/, '/assets/img/') : '';
  var PDF = BASE + 'agenda-2027-ALTO.pdf';
  var ls = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var track = function (ev, p) { try { if (window.gtag) gtag('event', ev, p || {}); if (window.fbq && ev === 'descarga_agenda') fbq('track', 'Lead'); } catch (e) {} };

  // ---------- estructura ----------
  var m = document.createElement('div'); m.className = 'ag-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'agT'); m.hidden = true;
  m.innerHTML =
    '<div class="ag-back" data-close></div>' +
    '<div class="ag-box">' +
    ' <button class="ag-x" type="button" aria-label="Cerrar" data-close>×</button>' +
    ' <div class="ag-art" aria-hidden="true"><img class="ag-rays" src="' + BASE + 'pop-rayos.svg" alt=""><img class="ag-cover" src="' + BASE + 'agenda-portada.webp" alt="">' +
    '  <img class="ag-scene" src="' + BASE + 'pop-escena.svg" alt=""><i class="ag-sp s1"></i><i class="ag-sp s2"></i><i class="ag-sp s3"></i></div>' +
    ' <div class="ag-txt">' +
    '  <span class="ag-k">🎁 Regalo de ALTO · 100 % gratis</span>' +
    '  <h2 id="agT">Tu agenda <em>2027</em>,<br>de regalo.</h2>' +
    '  <ul class="ag-list"><li>Calendario 2027 con feriados</li><li>Tus 3 objetivos del año</li><li>Plan piso por piso, por trimestre</li><li>Stickers para imprimir</li></ul>' +
    '  <form class="ag-form" novalidate>' +
    '   <label class="ag-f"><span>Tu nombre</span><input name="nombre" autocomplete="given-name" required placeholder="Cómo te llamás"></label>' +
    '   <label class="ag-f"><span>Email o WhatsApp</span><input name="contacto" autocomplete="email" required placeholder="Para mandarte novedades"></label>' +
    '   <label class="ag-ok"><input type="checkbox" name="acepto" checked> <span>Acepto recibir novedades de ALTO. Podés darte de baja cuando quieras.</span></label>' +
    '   <p class="ag-err" hidden>Completá tu nombre y un email o WhatsApp.</p>' +
    '   <button class="ag-btn" type="submit"><span>Quiero mi agenda</span> ↓</button>' +
    '   <p class="ag-mini">PDF en alta calidad, listo para imprimir.</p>' +
    '  </form>' +
    '  <div class="ag-again" hidden><b>Ya descargaste tu agenda 🙌</b><p>¿Querés descargarla de nuevo?</p>' +
    '   <div class="ag-again__b"><button type="button" class="ag-btn" data-again>Sí, descargar</button><button type="button" class="ag-ghost" data-close>No, gracias</button></div></div>' +
    '  <div class="ag-done" hidden><b>¡Listo! Tu agenda se está descargando ✨</b><p>Si no arrancó, <a href="' + PDF + '" download>tocá acá</a>. ¡Que tu 2027 sea bien alto!</p></div>' +
    ' </div>' +
    '</div>';
  var tab = document.createElement('button'); tab.type = 'button'; tab.className = 'ag-tab'; tab.hidden = true;
  tab.innerHTML = '<img src="' + BASE + 'stk-nubiface.webp" alt="" aria-hidden="true"><span>Tu agenda 2027 <b>gratis</b></span>';
  document.body.appendChild(m); document.body.appendChild(tab);
  var $ = function (s) { return m.querySelector(s); };
  var form = $('.ag-form'), again = $('.ag-again'), done = $('.ag-done'), err = $('.ag-err');

  var downloads = function () { return +(ls.get('alto-agenda-n') || 0); };
  function showTab() {
    var d = downloads();
    tab.classList.toggle('is-again', !!d);
    tab.querySelector('span').innerHTML = d ? 'Agenda 2027<b>Descargala de nuevo</b>' : 'Tu agenda 2027 <b>gratis</b>';
    tab.setAttribute('aria-label', d ? 'Descargar de nuevo la agenda 2027' : 'Abrir el regalo: agenda 2027 gratis');
    tab.hidden = false; requestAnimationFrame(function () { tab.classList.add('is-on'); });
  }
  function view(which) { form.hidden = which !== 'form'; again.hidden = which !== 'again'; done.hidden = which !== 'done'; }
  var lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    view(downloads() ? 'again' : 'form');
    m.hidden = false; tab.classList.remove('is-on'); document.documentElement.classList.add('ag-lock');
    requestAnimationFrame(function () { m.classList.add('is-on'); });
    setTimeout(function () { var f = m.querySelector(downloads() ? '[data-again]' : 'input[name=nombre]'); if (f) f.focus(); }, 450);
    track('agenda_popup_abierto');
  }
  function close() {
    m.classList.remove('is-on'); document.documentElement.classList.remove('ag-lock');
    setTimeout(function () { m.hidden = true; showTab(); if (lastFocus && lastFocus.focus) lastFocus.focus(); }, 380);
  }
  function download(datos) {
    var n = downloads() + 1; ls.set('alto-agenda-n', String(n));
    if (datos) ls.set('alto-agenda-datos', JSON.stringify(datos));
    var d = datos || JSON.parse(ls.get('alto-agenda-datos') || '{}');
    // aviso por email (FormSubmit). Si falla, la descarga sigue igual.
    try {
      fetch('https://formsubmit.co/ajax/' + AVISOS, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ _subject: '🎁 Descarga de la agenda 2027 (' + (n === 1 ? '1.ª vez' : n + '.ª vez') + ')', nombre: d.nombre || '-', contacto: d.contacto || '-',
          acepta_novedades: d.acepto ? 'Sí' : 'No', descarga_numero: n, pagina: location.href, fecha: new Date().toLocaleString('es-AR'), _template: 'table', _captcha: 'false' }) }).catch(function () {});
    } catch (e) {}
    track('descarga_agenda', { numero: n });
    var a = document.createElement('a'); a.href = PDF; a.download = 'agenda-2027-ALTO.pdf'; document.body.appendChild(a); a.click(); a.remove();
    view('done'); setTimeout(close, 3200);
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre = form.nombre.value.trim(), contacto = form.contacto.value.trim();
    var okC = /\S+@\S+\.\S+/.test(contacto) || contacto.replace(/\D/g, '').length >= 8;
    if (!nombre || !okC) { err.hidden = false; (nombre ? form.contacto : form.nombre).focus(); return; }
    err.hidden = true; download({ nombre: nombre, contacto: contacto, acepto: form.acepto.checked });
  });
  m.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) close();
    if (e.target.closest('[data-again]')) download(null);
  });
  document.addEventListener('keydown', function (e) {
    if (m.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { var f = [].slice.call(m.querySelectorAll('button:not([hidden]),input,a[href]')).filter(function (x) { return x.offsetParent; }); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } }
  });
  tab.addEventListener('click', open);
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href="#agenda"]'); if (a) { e.preventDefault(); open(); } });

  // primera visita: se abre sola una vez; después, solo la pestaña
  if (!ls.get('alto-agenda-visto')) { ls.set('alto-agenda-visto', '1'); setTimeout(open, DEMORA); }
  else setTimeout(showTab, 1200);
})();
