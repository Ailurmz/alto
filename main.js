/* =========================================================
   ALTO · LÓGICA Y MOVIMIENTO
   ---------------------------------------------------------
   No hace falta tocar este archivo para cambiar contenido:
   todo sale de js/data.js.
   Índice:
    1. Utilidades
    2. Contenido desde data.js
    3. Texto partido en palabras
    4. Ascensor: pisos, cielo y metros
    5. Cursor marca de altura
    6. La Torre: vista previa con modo de fusión
    7. Antes y después
    8. Marquesinas
    9. Botones imán y sticker arrastrable
   10. Formulario a WhatsApp
   11. Scroll suave + animaciones (GSAP)
   12. Carga inicial
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. Utilidades ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var DATA = window.ALTO || {};
  var C = DATA.contacto || {};
  var m2 = function (v) { return v.toFixed(2).replace(".", ",") + " m"; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var isLight = function (hex) { var n = parseInt(String(hex || "#000").slice(1), 16); return ((n >> 16) * .299 + ((n >> 8) & 255) * .587 + (n & 255) * .114) > 160; };
  var waLink = function (msg) { return "https://wa.me/" + (C.whatsapp || "") + (msg ? "?text=" + encodeURIComponent(msg) : ""); };

  /* ---------- 2. Contenido desde data.js ---------- */
  function fillMarquee(el, words) {
    if (!el) return;
    var chunk = words.map(function (w) { return '<span class="marquee__item">' + esc(w) + '<i>2,10</i></span>'; }).join("");
    el.innerHTML = chunk + chunk + chunk + chunk; // se repite para que el loop no tenga cortes
    el.setAttribute("aria-hidden", "true");
    var mq = el.parentNode, stop = document.createElement("span");
    stop.className = "marquee__stop"; stop.textContent = "Linda vista"; mq.appendChild(stop);
    mq.setAttribute("data-cursor", "Linda vista");
  }
  var serv = DATA.servicios || [];
  fillMarquee($("#mq1"), serv.slice(0, Math.ceil(serv.length / 2)));
  fillMarquee($("#mq2"), serv.slice(Math.ceil(serv.length / 2)));
  fillMarquee($("#mq3"), ["Subamos", "Un piso más arriba", "Diseño que se nota", "Webs que venden"]);

  var tower = $("#towerList");
  (DATA.proyectos || []).forEach(function (p, i) {
    var li = document.createElement("li"); li.className = "t-row"; li.dataset.i = i;
    var href = p.link ? esc(p.link) : "#terraza";
    li.innerHTML = '<a' + (p.link ? ' href="' + href + '" target="_blank" rel="noopener" data-cursor="Ver web"' : ' class="is-soon" data-cursor="En obra 🚧"') + '>' +
      '<span class="t-piso">Piso ' + esc(p.piso) + '</span>' +
      '<span class="t-cli">' + esc(p.cliente) + (p.ejemplo ? ' <span class="t-tag">ejemplo</span>' : "") + '</span>' +
      '<span class="t-meta t-rubro">' + esc(p.rubro) + '</span>' +
      '<span class="t-meta t-tipo">' + esc(p.tipo) + '</span>' +
      '<span class="t-meta t-anio">' + esc(p.anio || "") + '</span>' +
      '<span class="t-meta t-dias">' + (p.link ? 'Ver web' : '🚧 Disponible en breve') + '</span>' +
      '<span class="t-arrow" aria-hidden="true">' + (p.link ? '↗' : '·') + '</span></a>';
    tower && tower.appendChild(li);
  });

  var packs = $("#packs");
  (DATA.paquetes || []).forEach(function (k) {
    var el = document.createElement("article"); el.className = "pack" + (k.destacado ? " is-top" : "");
    el.innerHTML = (k.destacado ? '<span class="pack__flag">La vista más linda</span>' : "") +
      '<h3 class="pack__name">' + esc(k.nombre) + '</h3>' +
      '<p class="pack__price' + (isNaN(parseFloat(k.precio)) ? ' is-text' : '') + '">' + (k.desde ? '<small>desde</small>' : "") + '<b>' + esc(k.precio) + '</b>' + (k.moneda ? '<small>' + esc(k.moneda) + '</small>' : "") + '</p>' +
      '<p class="pack__time">' + esc(k.plazo) + (k.pago ? ' <span class="pack__pay">' + esc(k.pago) + '</span>' : '') + '</p>' +
      '<div><p style="margin-bottom:12px">' + esc(k.bajada) + '</p><ul class="pack__list">' + (k.incluye || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div>' +
      '<a class="btn ' + (k.destacado ? "btn--ember" : "btn--ghost") + ' magnet" href="#terraza" data-pack="' + esc(k.id) + '" data-hover="Buena elección"><span>Quiero este</span></a>';
    packs && packs.appendChild(el);
  });

  var tpls = $("#tpls");
  function tplMsg(t, inst) { return "Hola ALTO, quiero la plantilla " + t.nombre + (t.precio ? " (" + t.precio + " " + (t.moneda || "") + ")" : "") + (inst ? ", con instalación (+" + (DATA.instalacion || "20") + " USD)" : ", la instalo yo con la guía") + "."; }
  (DATA.plantillas || []).forEach(function (t) {
    var el = document.createElement("article"); el.className = "tpl";
    var light = isLight(t.color);
    el.innerHTML = '<div class="tpl__shot tpl__shot--' + esc(t.estilo || "a") + (light ? " is-light" : "") + '" style="--c:' + esc(t.color) + '" aria-hidden="true">' +
        '<div class="tpl__bar"><i></i><i></i><i></i></div><div class="tpl__page"><span class="tpl__logo"></span><b>' + esc(t.nombre.split(" ")[0]) + '</b><span class="tpl__l1"></span><span class="tpl__l2"></span><span class="tpl__btn"></span><span class="tpl__media"></span></div></div>' +
      '<div class="tpl__body"><div class="tpl__head"><h3>' + esc(t.nombre) + '</h3><p class="tpl__price">' + (t.precio ? '<b>' + esc(t.precio) + '</b> ' + esc(t.moneda || "") : '<span class="t-tag">Precio pronto</span>') + '</p></div>' +
      '<p class="tpl__ideal mono">Ideal para ' + esc(t.ideal) + '</p>' +
      '<ul class="pack__list">' + (t.incluye || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul>' +
      '<div class="tpl__btns">' + (t.demo ? '<a class="btn btn--ghost btn--sm magnet" href="' + esc(t.demo) + '" target="_blank" rel="noopener" data-hover="Mirá"><span>Ver demo</span></a>' : '<span class="btn btn--ghost btn--sm is-soon" aria-disabled="true"><span>Disponible en breve</span></span>') +
      '<a class="btn btn--dark btn--sm magnet tpl__buy" href="' + esc(waLink(tplMsg(t, false))) + '" target="_blank" rel="noopener" data-hover="Es tuya"><span>La quiero</span></a></div>' +
      '<label class="check tpl__inst"><input type="checkbox" data-inst="' + esc(t.nombre) + '"><span>Quiero que me la instalen (+' + esc(DATA.instalacion || "20") + ' USD)</span></label></div>';
    tpls && tpls.appendChild(el);
  });

  // el check de instalación cambia el mensaje del botón "La quiero"
  $$("[data-inst]").forEach(function (cb) {
    cb.addEventListener("change", function () {
      var t = (DATA.plantillas || []).filter(function (x) { return x.nombre === cb.dataset.inst; })[0]; if (!t) return;
      cb.closest(".tpl").querySelector(".tpl__buy").href = waLink(tplMsg(t, cb.checked));
    });
  });

  var extras = $("#extras");
  (DATA.extras || []).forEach(function (x) {
    var li = document.createElement("li");
    li.innerHTML = '<div><b>' + esc(x.nombre) + '</b><span>' + esc(x.detalle) + '</span></div><em>' + esc(x.precio) + '</em>';
    extras && extras.appendChild(li);
  });

  var reviews = $("#reviews");
  (DATA.opiniones || []).forEach(function (o) {
    var a = parseFloat(String(o.antes).replace(",", ".")) || 1, d = parseFloat(String(o.despues).replace(",", ".")) || 2;
    var el = document.createElement("figure"); el.className = "review"; el.style.margin = "0";
    el.innerHTML = '<blockquote>“' + esc(o.texto) + '”</blockquote>' +
      '<div class="review__m" aria-label="Marca de altura: antes ' + esc(o.antes) + ' metros, después ' + esc(o.despues) + ' metros">' +
      '<i style="height:' + Math.round(a / 2.1 * 100) + '%"></i><i style="height:' + Math.round(d / 2.1 * 100) + '%"></i><span>' + esc(o.antes) + ' → ' + esc(o.despues) + ' m</span></div>' +
      '<footer><span><b>' + esc(o.nombre) + '</b><br>' + esc(o.marca) + '</span>' + (o.ejemplo ? '<span class="t-tag">ejemplo</span>' : "") + '</footer>';
    reviews && reviews.appendChild(el);
  });

  var sel = $("#fPaquete");
  if (sel) {
    (DATA.paquetes || []).forEach(function (k) { var o = document.createElement("option"); o.value = "la web " + k.nombre; o.textContent = k.nombre; sel.appendChild(o); });
    (DATA.plantillas || []).forEach(function (t) { var o = document.createElement("option"); o.value = "la plantilla " + t.nombre; o.textContent = "Plantilla para descargar: " + t.nombre; sel.appendChild(o); });
    var o2 = document.createElement("option"); o2.value = "todavía no sé qué paquete"; o2.textContent = "Todavía no sé"; sel.appendChild(o2);
  }

  var direct = $("#direct");
  if (direct) {
    var rows = [
      ["WhatsApp directo", waLink("Hola ALTO, quiero subir mi marca."), (C.whatsappTexto || "+" + (C.whatsapp || ""))],
      ["Email", "mailto:" + (C.email || ""), C.email || ""],
      ["Instagram", "https://instagram.com/" + (C.instagram || ""), "@" + (C.instagram || "")],
      C.tiktok ? ["TikTok", "https://tiktok.com/@" + C.tiktok, "@" + C.tiktok] : null
    ].filter(Boolean);
    direct.innerHTML = rows.map(function (r) {
      if (!r[1]) return '<li><span class="direct__soon"><span>' + r[0] + '</span><span>' + esc(r[2]) + '</span></span></li>';
      return '<li><a href="' + esc(r[1]) + '" target="_blank" rel="noopener"><span>' + r[0] + '</span><span>' + esc(r[2]) + '</span></a></li>';
    }).join("");
  }

  /* ---------- 3. Texto partido en palabras (para que suban) ---------- */
  $$(".split").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map(function (w) { return '<span class="wd" aria-hidden="true"><span>' + esc(w) + '</span></span>'; }).join(" ");
  });

  /* ---------- 4. Ascensor: pisos, cielo y metros ---------- */
  var body = document.body, evFloor = $("#evFloor"), evName = $("#evName"), evM = $("#evM"), evBox = $(".elevator"), top = $("#top");
  var SKY = { dia: 0, atardecer: .5, noche: 1 };
  function setFloor(sec) {
    var f = sec.getAttribute("data-floor");
    evFloor.textContent = f === "PB" ? "PB" : (f === "T" ? "TERRAZA" : "PISO " + f);
    evName.textContent = sec.getAttribute("data-name");
    var sky = sec.getAttribute("data-sky") || "dia";
    if (body.getAttribute("data-sky") !== sky) body.setAttribute("data-sky", sky);
    window.ALTO_SKY && window.ALTO_SKY.setTarget(SKY[sky]);
  }
  var floors = $$("[data-floor]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) setFloor(e.target); }); }, { rootMargin: "-45% 0px -54% 0px" });
    floors.forEach(function (f) { io.observe(f); });
  }
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY || 0, max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    evM.textContent = m2(Math.min(1, y / max) * 2.1);
    evBox.classList.toggle("is-down", y < lastY - 2);
    top.classList.toggle("is-scrolled", y > 30);
    lastY = y;
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- 5. Cursor: marca de altura ---------- */
  var cur = $("#cursor"), curVal = $("#cursorVal"), curDot = $(".cursor__dot");
  if (cur && FINE && !REDUCED) {
    var cx = innerWidth / 2, cy = innerHeight / 2, px = cx, py = cy, label = "";
    addEventListener("pointermove", function (e) { cx = e.clientX; cy = e.clientY; cur.classList.add("is-on"); }, { passive: true });
    document.addEventListener("mouseleave", function () { cur.classList.remove("is-on"); });
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest ? e.target.closest("[data-cursor],a,button,input,select,textarea,.ba") : null;
      cur.classList.toggle("is-hover", !!t);
      label = t && t.getAttribute("data-cursor") ? t.getAttribute("data-cursor") : (t && t.classList.contains("ba") ? "Arrastrá" : "");
    });
    (function loop() {
      px += (cx - px) * .22; py += (cy - py) * .22;
      cur.style.transform = "translate3d(0," + py + "px,0)";
      curDot.style.transform = "translate3d(" + px + "px,0,0)";
      curVal.style.transform = "translate3d(" + px + "px,0,0)";
      var max = document.documentElement.scrollHeight;
      curVal.textContent = label || m2(Math.max(0, Math.min(1, (window.scrollY + py) / max)) * 2.1);
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 6. La Torre: vista previa con modo de fusión ---------- */
  var prev = $("#preview"), prevIn = $("#previewIn");
  if (prev && FINE) {
    var vx = 0, vy = 0, tx = 0, ty = 0, rot = 0, on = false;
    function mock(p) {
      if (p.imagen) return '<img src="' + esc(p.imagen) + '" alt="" loading="lazy" decoding="async">';
      var light = isLight(p.color);
      return '<div class="mockweb' + (light ? " is-light" : "") + '" style="background:' + esc(p.color) + '"><div class="mockweb__nav"><b>' + esc(p.cliente.split(" ")[0].toUpperCase()) + '</b><span>' + esc(p.rubro) + ' · ' + esc(p.tipo) + '</span></div><h4>' + esc(p.cliente) + '</h4><span class="mockweb__btn">Ver más</span></div>';
    }
    $$(".t-row").forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        var p = (DATA.proyectos || [])[row.dataset.i]; if (!p) return;
        prevIn.innerHTML = mock(p) + '<span class="preview__tint"></span>';
        prev.classList.remove("is-on"); void prev.offsetWidth; prev.classList.add("is-on"); on = true;
      });
      row.addEventListener("mouseleave", function () { prev.classList.remove("is-on"); on = false; });
    });
    addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      var dx = tx - vx; vx += dx * .14; vy += (ty - vy) * .14; rot += ((dx * .04) - rot) * .1;
      prev.style.left = vx + "px"; prev.style.top = vy + "px"; prev.style.rotate = Math.max(-8, Math.min(8, rot)) + "deg";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 7. Antes y después ---------- */
  var ba = $("#ba");
  if (ba) {
    var drag = false;
    var setPos = function (p) { p = Math.max(3, Math.min(97, p)); ba.style.setProperty("--pos", p + "%"); ba.setAttribute("aria-valuenow", Math.round(p)); };
    var fromX = function (x) { var r = ba.getBoundingClientRect(); setPos((x - r.left) / r.width * 100); };
    ba.addEventListener("pointerdown", function (e) { drag = true; ba.setPointerCapture(e.pointerId); fromX(e.clientX); });
    ba.addEventListener("pointermove", function (e) { if (drag) fromX(e.clientX); });
    ba.addEventListener("pointerup", function () { drag = false; });
    ba.addEventListener("pointercancel", function () { drag = false; });
    ba.addEventListener("keydown", function (e) {
      var cur = parseFloat(ba.style.getPropertyValue("--pos")) || 50;
      if (e.key === "ArrowLeft") { setPos(cur - 5); e.preventDefault(); }
      if (e.key === "ArrowRight") { setPos(cur + 5); e.preventDefault(); }
    });
  }

  /* ---------- 8. Marquesinas: pasan solas, aceleran con el scroll, frenan al pasar el mouse ---------- */
  var mqs = $$(".marquee").map(function (m) { return { el: m.querySelector(".marquee__track"), dir: parseFloat(m.dataset.dir) || -1, x: 0, hover: false, box: m }; });
  mqs.forEach(function (m) { m.box.addEventListener("mouseenter", function () { m.hover = true; }); m.box.addEventListener("mouseleave", function () { m.hover = false; }); });
  var vel = 0, prevY = window.scrollY;
  if (!REDUCED) (function loop() {
    var y = window.scrollY; vel += ((y - prevY) - vel) * .1; prevY = y;
    mqs.forEach(function (m) {
      if (!m.el) return;
      var half = m.el.scrollWidth / 2; if (!half) return;
      var sp = m.hover ? 0 : (0.6 + Math.min(8, Math.abs(vel) * .25));
      m.x += sp * m.dir;
      if (m.x <= -half) m.x += half; if (m.x > 0) m.x -= half;
      m.el.style.transform = "translate3d(" + m.x + "px,0,0)";
    });
    requestAnimationFrame(loop);
  })();

  /* ---------- 9. Botones imán + sticker arrastrable ---------- */
  if (FINE && !REDUCED) {
    $$(".magnet").forEach(function (b) {
      b.addEventListener("mousemove", function (e) { var r = b.getBoundingClientRect(); var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2; b.style.transform = "translate(" + x * .25 + "px," + y * .3 + "px)"; });
      b.addEventListener("mouseleave", function () { b.style.transition = "transform .5s cubic-bezier(.22,1,.36,1)"; b.style.transform = ""; setTimeout(function () { b.style.transition = ""; }, 500); });
    });
    var st = $(".stop.sticker");
    if (st) {
      var sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
      st.setAttribute("data-cursor", "Arrastrame");
      st.addEventListener("pointerdown", function (e) { dragging = true; ox = e.clientX - sx; oy = e.clientY - sy; st.setPointerCapture(e.pointerId); st.style.cursor = "grabbing"; });
      st.addEventListener("pointermove", function (e) { if (!dragging) return; sx = e.clientX - ox; sy = e.clientY - oy; st.style.translate = sx + "px " + sy + "px"; });
      st.addEventListener("pointerup", function () { dragging = false; st.style.cursor = ""; });
    }
  }

  /* ---------- 10. Formulario a WhatsApp ---------- */
  var fB = $("#fMarcaNueva"), fN = $("#fNombre"), fM = $("#fMarca"), fP = $("#fPaquete"), fT = $("#fMsj"), wa = $("#waBtn"), err = $("#fErr"), ok = $("#fOk");
  function buildMsg() {
    var n = (fN.value || "").trim() || "[tu nombre]";
    var msg = "Hola ALTO, quiero subir mi marca. Soy " + n + ", necesito " + (fP.value || "una web") + ".";
    if ((fM.value || "").trim()) msg += " Mi negocio: " + fM.value.trim() + ".";
    if (fB && fB.checked) msg += " No tengo logo ni identidad de marca: necesito que la armen también.";
    if ((fT.value || "").trim()) msg += " " + fT.value.trim();
    return msg;
  }
  function refresh() { if (wa) wa.href = waLink(buildMsg()); }
  [fN, fM, fP, fT, fB].forEach(function (el) { el && el.addEventListener(el === fB ? "change" : "input", function () { refresh(); if (el === fN && fN.value.trim()) { err.hidden = true; fN.parentNode.classList.remove("is-err"); } }); });
  refresh();
  if (wa) wa.addEventListener("click", function (e) {
    if (!fN.value.trim()) { e.preventDefault(); err.hidden = false; fN.parentNode.classList.add("is-err"); fN.focus(); return; }
    refresh(); ok.hidden = false;
  });
  $("#form") && $("#form").addEventListener("submit", function (e) { e.preventDefault(); wa && wa.click(); });
  // botones "Quiero este" de los paquetes: eligen el paquete en el formulario
  document.addEventListener("click", function (e) {
    var nb = e.target.closest && e.target.closest("[data-brand]"); if (nb && fB) { fB.checked = true; refresh(); return; }
    var b = e.target.closest && e.target.closest("[data-pack]"); if (!b || !fP) return;
    var k = (DATA.paquetes || []).filter(function (x) { return x.id === b.dataset.pack; })[0];
    if (k) { fP.value = "la " + k.nombre; refresh(); }
  });

  /* ---------- 11. Scroll suave + animaciones ---------- */
  var hasG = !!(window.gsap && window.ScrollTrigger);
  var lenis = null;
  if (!REDUCED && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    if (hasG) { lenis.on("scroll", window.ScrollTrigger.update); window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); window.gsap.ticker.lagSmoothing(0); }
    else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
  }
  // anclas internas (#terraza, #torre…) con el ascensor suave
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute("href"); if (id.length < 2) { e.preventDefault(); return; }
    var target = document.querySelector(id); if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.6 }); else target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
    if (id === "#terraza" && fN) setTimeout(function () { fN.focus({ preventScroll: true }); }, 1400);
  });

  if (hasG && !REDUCED) {
    var g = window.gsap, ST = window.ScrollTrigger; g.registerPlugin(ST);
    var EASE = "power3.out";

    // títulos: las palabras suben y se estiran (como el logo)
    $$(".split").forEach(function (el) {
      if (el.classList.contains("manifesto__text")) return;
      g.fromTo($$(".wd>span", el), { yPercent: 110, scaleY: .4 }, { yPercent: 0, scaleY: 1, duration: .6, stagger: .05, ease: EASE, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
    // manifiesto: las palabras llegan desde los costados y se acomodan con el scroll
    $$(".manifesto__text .wd>span").forEach(function (w, i) {
      g.fromTo(w, { x: (i % 2 ? 1 : -1) * (80 + i * 22), y: 60, rotate: (i % 2 ? 1 : -1) * 14, opacity: .25 }, { x: 0, y: 0, rotate: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".manifesto", start: "top 85%", end: "center 55%", scrub: .8 } });
    });
    // tarjetas y filas suben al aparecer
    ST.batch(".t-row, .pack, .tpl, .review, .meter, .form, .direct li", { start: "top 92%", once: true, onEnter: function (els) { g.fromTo(els, { y: 50, opacity: .35 }, { y: 0, opacity: 1, duration: .55, stagger: .07, ease: EASE, clearProps: "transform" }); } });
    // el sol se va al hacer scroll, el título sube un poco
    g.to(".sun", { yPercent: 35, scale: 1.12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    g.to(".hero__title", { yPercent: -12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    // barras del antes/después crecen
    g.fromTo(".meter__bar", { scaleY: .12 }, { scaleY: 1, duration: .9, stagger: .15, ease: EASE, scrollTrigger: { trigger: ".meter", start: "top 80%", once: true } });

    // Piso 4: sección fija, el ascensor recorre las 4 paradas
    var mm = g.matchMedia();
    mm.add("(min-width: 861px)", function () {
      var cards = $$(".stop-card"), car = $("#car"), shaft = $(".shaft");
      ST.create({
        trigger: ".process", start: "top top", end: "+=220%", pin: ".process__pin", scrub: true,
        onUpdate: function (st) {
          var idx = Math.min(3, Math.floor(st.progress * 4));
          cards.forEach(function (c, i) { c.classList.toggle("is-on", i <= idx); });
          car.style.transform = "translate(" + (st.progress * (shaft.clientWidth - 34)) + "px,-50%)";
        }
      });
    });
    mm.add("(max-width: 860px)", function () { $$(".stop-card").forEach(function (c) { c.classList.add("is-on"); }); });
  } else {
    $$(".stop-card").forEach(function (c) { c.classList.add("is-on"); });
  }

  /* ---------- 12. Carga inicial: "Llamando al ascensor…" ---------- */
  var html = document.documentElement, lf = $("#loaderFloor"), mark = $("#heroMark"), markVal = $("#heroMarkVal");
  function intro() {
    if (!hasG || REDUCED) return;
    var g = window.gsap, tl = g.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero__title .w", { yPercent: 110, scaleY: .4 }, { yPercent: 0, scaleY: 1.3, duration: .7, stagger: .09 }, 0)
      .fromTo(".sun", { scale: .3, rotate: -30, filter: "brightness(.4)" }, { scale: 1, rotate: 0, filter: "brightness(1)", duration: 1, ease: "expo.out" }, .15)
      .fromTo(".stop.sticker", { scale: 0, rotate: -40 }, { scale: 1, rotate: 10, duration: .9, ease: "back.out(2.4)" }, .55)
      .fromTo(".hero__kicker, .hero__foot > *", { y: 30, opacity: .2 }, { y: 0, opacity: 1, duration: .55, stagger: .08 }, .35);
    if (mark) {
      var o = { v: 0 };
      g.set(mark, { top: "100%" });
      tl.to(mark, { top: "0%", duration: 1.1, ease: "power3.inOut" }, .2)
        .to(o, { v: 2.1, duration: 1.1, ease: "power3.inOut", onUpdate: function () { markVal.textContent = o.v.toFixed(2).replace(".", ","); } }, .2);
    }
  }
  if (html.classList.contains("is-loading")) {
    var seq = ["03", "02", "01", "PB"], i = 0;
    var tick = setInterval(function () { i++; if (lf && seq[i]) lf.textContent = seq[i]; if (i >= seq.length - 1) { clearInterval(tick); setTimeout(function () { html.classList.remove("is-loading"); setTimeout(intro, 250); }, 260); } }, 240);
  } else { intro(); }
})();
