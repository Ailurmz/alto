/* ALTO · comportamiento compartido de las demos */
(function () {
  var d = document, root = d.documentElement; root.classList.add('js');
  var $$ = function (s) { return [].slice.call(d.querySelectorAll(s)); };

  // aparición al bajar
  var els = $$('.d-sh,.d-card,.d-quote,.d-offer,.d-gallery figure,.d-case,.d-post,.d-steps li,.d-about__img,.d-form,.d-faq details,.d-port figure,.d-sched li');
  if ('IntersectionObserver' in window) {
    els.forEach(function (e, i) { e.classList.add('rv'); e.style.transitionDelay = (i % 4) * 90 + 'ms'; });
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }

  // contadores
  $$('[data-count]').forEach(function (b) {
    var m = b.textContent.match(/^(\D*)([\d.]+)(.*)$/); if (!m) return;
    var to = parseFloat(m[2].replace(/\./g, '')), dots = m[2].indexOf('.') > -1, t0;
    var fmt = function (n) { n = Math.round(n); return dots ? n.toLocaleString('es-AR') : String(n); };
    b.textContent = m[1] + '0' + m[3];
    setTimeout(function () { (function f(t) { t0 = t0 || t; var k = Math.min(1, (t - t0) / 1600); b.textContent = m[1] + fmt(to * (1 - Math.pow(1 - k, 3))) + m[3]; if (k < 1) requestAnimationFrame(f); })(performance.now()); }, 500);
  });

  // menú del celular
  var bur = d.querySelector('.d-burger');
  if (bur) bur.addEventListener('click', function () { d.body.classList.toggle('is-menu'); });
  $$('.d-nav a').forEach(function (a) { a.addEventListener('click', function () { d.body.classList.remove('is-menu'); }); });

  // botones de la demo: avisan qué haría el botón en la web real
  var toast = d.querySelector('.d-toast'), tt;
  var show = function (e) { if (e) e.preventDefault(); toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-on'); }, 5200); };
  $$('[data-demo-cta]').forEach(function (a) { a.addEventListener('click', show); });
  $$('[data-demo-form]').forEach(function (f) { f.addEventListener('submit', show); });

  // cuenta regresiva de la promo
  $$('[data-timer] b').forEach(function (b) {
    var end = new Date(); end.setHours(23, 59, 59, 0);
    (function tick() { var s = Math.max(0, Math.floor((end - new Date()) / 1000)); var p = function (n) { return (n < 10 ? '0' : '') + n; };
      b.textContent = p(Math.floor(s / 3600)) + ':' + p(Math.floor(s / 60) % 60) + ':' + p(s % 60); setTimeout(tick, 1000); })();
  });
})();
