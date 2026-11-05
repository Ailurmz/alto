/* =========================================================
   ALTO · ANIMACIÓN DEL SOL
   ---------------------------------------------------------
   Si en data.js cargaste "videoSol", reproduce ese video.
   Si no, dibuja un edificio que se construye piso por piso
   al atardecer: se prenden las ventanas, sube una luz de
   ascensor y arriba titila la antena. Después vuelve a empezar.
   ========================================================= */
(function () {
  var data = window.ALTO || {};
  var video = document.getElementById("sunVideo");
  var cv = document.getElementById("reel");
  if (!cv) return;

  if (data.videoSol && video) {
    video.src = data.videoSol; video.hidden = false; cv.hidden = true;
    video.play && video.play().catch(function () {});
    return;
  }

  var ctx = cv.getContext("2d");
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(2, window.devicePixelRatio || 1), W = 0, H = 0;
  function size() { var r = cv.getBoundingClientRect(); W = Math.max(50, r.width); H = Math.max(50, r.height); cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); addEventListener("resize", size);

  var FLOORS = 11, CYCLE = 9; // pisos del edificio principal y segundos por vuelta
  // ventanas que se prenden: patrón fijo para que no "parpadee" al azar
  var lit = []; for (var i = 0; i < FLOORS * 3; i++) lit.push(((i * 37) % 11) > 3);

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function draw(now) {
    var t = reduced ? CYCLE * .7 : (now / 1000) % CYCLE;
    var grow = Math.min(1, t / (CYCLE * .55));          // 0→1 mientras se construye
    var fade = t > CYCLE * .9 ? 1 - (t - CYCLE * .9) / (CYCLE * .1) : 1;
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = fade;

    var ground = H * .86, fh = H * .052;               // alto de cada piso
    // edificios del fondo
    ctx.fillStyle = "rgba(11,13,42,.28)";
    ctx.fillRect(W * .12, ground - fh * 6, W * .16, fh * 6);
    ctx.fillRect(W * .7, ground - fh * 8, W * .17, fh * 8);
    ctx.fillStyle = "rgba(11,13,42,.18)";
    ctx.fillRect(W * .26, ground - fh * 4, W * .12, fh * 4);
    ctx.fillRect(W * .62, ground - fh * 5, W * .1, fh * 5);

    // edificio principal: crece piso por piso
    var bw = W * .26, bx = (W - bw) / 2;
    var floorsNow = Math.floor(ease(grow) * FLOORS + .0001);
    var partial = ease(grow) * FLOORS - floorsNow;
    var topY = ground - (floorsNow + partial) * fh;
    ctx.fillStyle = "#0B0D2A";
    ctx.fillRect(bx, topY, bw, ground - topY);

    // ventanas: 3 por piso, se prenden un ratito después de construir cada piso
    for (var f = 0; f < floorsNow; f++) {
      var y = ground - (f + 1) * fh + fh * .28;
      for (var c = 0; c < 3; c++) {
        var on = lit[f * 3 + c] && (t > (f / FLOORS) * CYCLE * .55 + .35);
        ctx.fillStyle = on ? "#FFC53D" : "rgba(242,238,230,.16)";
        ctx.fillRect(bx + bw * (.14 + c * .27), y, bw * .18, fh * .44);
      }
    }

    // luz de ascensor que sube por el costado
    if (floorsNow > 0) {
      var ey = ground - ((t * 1.6) % (floorsNow + partial)) * fh - fh * .5;
      ctx.fillStyle = "#FF5A1F";
      ctx.fillRect(bx + bw - bw * .07, ey, bw * .04, fh * .7);
    }

    // antena con luz cuando el edificio está completo
    if (grow >= 1) {
      ctx.fillStyle = "#0B0D2A";
      ctx.fillRect(bx + bw / 2 - 1.5, topY - fh * 1.6, 3, fh * 1.6);
      var blink = reduced ? 1 : (Math.sin(now / 260) > 0 ? 1 : .25);
      ctx.fillStyle = "rgba(255,90,31," + blink + ")";
      ctx.beginPath(); ctx.arc(bx + bw / 2, topY - fh * 1.7, Math.max(3, W * .012), 0, Math.PI * 2); ctx.fill();
      // marca de altura: 2,10
      ctx.fillStyle = "#121216";
      ctx.fillRect(bx + bw + W * .03, topY, W * .08, 2);
      ctx.font = "500 " + Math.max(10, W * .042) + "px 'DM Mono', monospace";
      ctx.fillText("2,10", bx + bw + W * .03, topY - 6);
    }

    // piso (vereda)
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(11,13,42,.55)";
    ctx.fillRect(0, ground, W, H - ground);

    if (!reduced) requestAnimationFrame(draw);
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { requestAnimationFrame(draw); });
})();
