/* =========================================================
   ALTO · CAPA DE VUELO (canvas 2D, sin librerías)
   Viento, partículas que suben, nubes que pasan hacia abajo
   (sensación de estar subiendo), un avión de papel y pájaros.
   - Todo se acelera cuando bajás la página.
   - Cambia de color con el cielo: día, atardecer y noche.
   - Se apaga con "reducir movimiento" y si el equipo va lento.
   ========================================================= */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cv = document.createElement('canvas'); cv.id = 'vuelo'; cv.setAttribute('aria-hidden', 'true');
  var sky = document.getElementById('sky');
  (sky && sky.parentNode ? sky.parentNode.insertBefore(cv, sky.nextSibling) : document.body.prepend(cv));
  var x = cv.getContext('2d'); if (!x) return;
  var coarse = matchMedia('(pointer: coarse)').matches, DPR = Math.min(coarse ? 1.5 : 2, window.devicePixelRatio || 1);
  var W, H, R = Math.random;
  function size() { W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; x.setTransform(DPR, 0, 0, DPR, 0, 0); }
  size(); addEventListener('resize', size);

  // colores por cielo
  var PAL = {
    dia:       { wind: '43,59,255', dot: '43,59,255', cloud: '255,255,255', plane: '#2B3BFF', bird: '18,18,22' },
    atardecer: { wind: '255,90,31', dot: '255,197,61', cloud: '255,236,214', plane: '#FF5A1F', bird: '40,20,30' },
    noche:     { wind: '255,255,255', dot: '255,229,160', cloud: '120,128,200', plane: '#FFC53D', bird: '230,230,255' }
  };
  function pal() { return PAL[document.body.getAttribute('data-sky')] || PAL.dia; }

  // velocidad de scroll (suavizada)
  var lastY = scrollY, vel = 0;
  addEventListener('scroll', function () { var d = scrollY - lastY; lastY = scrollY; vel += d * 0.08; }, { passive: true });

  // ---- viento: estelas finas que cruzan en diagonal hacia arriba
  var NW = coarse ? 14 : 30, winds = [];
  function newWind(w, first) { w.x = first ? R() * W : -R() * W * 0.4 - 200; w.y = R() * H * 1.2; w.len = 80 + R() * 240; w.sp = 1.2 + R() * 2.6; w.a = 0.09 + R() * 0.14; w.ph = R() * 6.28; w.amp = 6 + R() * 18; return w; }
  for (var i = 0; i < NW; i++) winds.push(newWind({}, true));

  // ---- partículas que suben (de noche titilan como estrellas)
  var ND = coarse ? 22 : 55, dots = [];
  function newDot(d, first) { d.x = R() * W; d.y = first ? R() * H : H + 10; d.r = 0.6 + R() * 2.2; d.sp = 0.15 + R() * 0.6; d.sw = R() * 6.28; d.tw = R() * 6.28; return d; }
  for (i = 0; i < ND; i++) dots.push(newDot({}, true));

  // ---- nubes: bajan cuando subís
  var NC = coarse ? 3 : 6, clouds = [];
  function newCloud(c, first) { c.s = 0.5 + R() * 1.1; c.x = R() * W; c.y = first ? R() * H : -160 * c.s; c.drift = 0.08 + R() * 0.2; c.par = 0.25 + c.s * 0.35; return c; }
  for (i = 0; i < NC; i++) clouds.push(newCloud({}, true));
  function drawCloud(c, col) {
    var g = x.createRadialGradient(c.x, c.y, 0, c.x, c.y, 140 * c.s);
    g.addColorStop(0, 'rgba(' + col + ',.38)'); g.addColorStop(1, 'rgba(' + col + ',0)');
    x.fillStyle = g;
    [[0, 0, 1], [-70, 18, .75], [70, 14, .8], [-30, -26, .7], [40, -20, .65]].forEach(function (p) {
      x.beginPath(); x.ellipse(c.x + p[0] * c.s, c.y + p[1] * c.s, 120 * c.s * p[2], 60 * c.s * p[2], 0, 0, 6.283); x.fill();
    });
  }

  // ---- avión de papel: recorre una curva que sube, con estela punteada
  var plane = { t: -1, wait: 2.5, p0: 0, p1: 0, p2: 0, p3: 0, trail: [] };
  function launchPlane() {
    var fromLeft = R() > 0.35;
    plane.p0 = { x: fromLeft ? -60 : W + 60, y: H * (0.65 + R() * 0.3) };
    plane.p3 = { x: fromLeft ? W + 80 : -80, y: H * (0.05 + R() * 0.25) };
    plane.p1 = { x: W * (fromLeft ? 0.3 : 0.7), y: H * (0.2 + R() * 0.7) };
    plane.p2 = { x: W * (fromLeft ? 0.65 : 0.35), y: H * (R() * 0.9) };
    plane.t = 0; plane.trail = []; plane.dur = 7 + R() * 4;
  }
  function bez(a, b, c, d, t) { var u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; }
  function drawPlane(px, py, ang, col) {
    x.save(); x.translate(px, py); x.rotate(ang); x.scale(1.15, 1.15);
    x.fillStyle = col; x.strokeStyle = col; x.lineWidth = 1.2; x.lineJoin = 'round';
    x.beginPath(); x.moveTo(18, 0); x.lineTo(-14, -10); x.lineTo(-6, 0); x.closePath(); x.globalAlpha = .95; x.fill();
    x.beginPath(); x.moveTo(18, 0); x.lineTo(-14, 10); x.lineTo(-6, 0); x.closePath(); x.globalAlpha = .65; x.fill();
    x.beginPath(); x.moveTo(18, 0); x.lineTo(-6, 0); x.lineTo(-10, 5); x.closePath(); x.globalAlpha = .4; x.fill();
    x.restore(); x.globalAlpha = 1;
  }

  // ---- pájaros: bandada en V que cruza de vez en cuando
  var flock = { on: false, wait: 6, x: 0, y: 0, sp: 1, birds: [] };
  function launchFlock() {
    flock.on = true; flock.x = -120; flock.y = H * (0.12 + R() * 0.35); flock.sp = 1.1 + R() * 0.8; flock.birds = [];
    var n = 5 + Math.floor(R() * 4);
    for (var k = 0; k < n; k++) { var row = Math.ceil(k / 2), side = k % 2 ? -1 : 1; flock.birds.push({ dx: -row * 26, dy: k ? side * row * 15 : 0, ph: R() * 6.28, s: 0.8 + R() * 0.4 }); }
  }
  function drawBird(bx, by, ph, s, col) {
    var f = Math.sin(ph) * 6 * s;
    x.strokeStyle = col; x.lineWidth = 1.6; x.lineCap = 'round';
    x.beginPath(); x.moveTo(bx - 9 * s, by - f); x.quadraticCurveTo(bx - 4 * s, by - f * 0.2 - 2, bx, by); x.quadraticCurveTo(bx + 4 * s, by - f * 0.2 - 2, bx + 9 * s, by - f); x.stroke();
  }

  // ---- bucle
  var last = performance.now(), frames = 0, slow = 0, run = true;
  document.addEventListener('visibilitychange', function () { run = !document.hidden; if (run) { last = performance.now(); requestAnimationFrame(loop); } });
  function loop(now) {
    if (!run) return;
    var dt = Math.min(50, now - last) / 16.67; last = now;
    if (frames < 120) { frames++; if (dt > 2.8) slow++; if (frames === 120 && slow > 50) { cv.remove(); return; } }
    vel *= 0.9; var boost = Math.max(-6, Math.min(14, vel));
    var P = pal(), night = document.body.getAttribute('data-sky') === 'noche';
    x.clearRect(0, 0, W, H);

    // nubes (debajo de todo)
    clouds.forEach(function (c) {
      c.x += c.drift * dt; c.y += (0.12 + boost * c.par) * dt;
      if (c.y > H + 180 * c.s) newCloud(c, false); if (c.y < -260) c.y = H + 150; if (c.x > W + 300) c.x = -300;
      x.globalAlpha = night ? 0.35 : 0.9; drawCloud(c, P.cloud);
    });
    x.globalAlpha = 1;

    // viento
    var t = now / 1000;
    winds.forEach(function (w) {
      var sp = w.sp * (1 + Math.abs(boost) * 0.25);
      w.x += sp * 2.2 * dt; w.y -= sp * 0.55 * dt + boost * 0.25 * dt;
      if (w.x - w.len > W || w.y < -40 || w.y > H * 1.3) newWind(w, false);
      var len = w.len * (1 + Math.abs(boost) * 0.08), yy = w.y + Math.sin(t * 1.3 + w.ph) * w.amp;
      var g = x.createLinearGradient(w.x - len, yy + len * 0.25, w.x, yy);
      g.addColorStop(0, 'rgba(' + P.wind + ',0)'); g.addColorStop(1, 'rgba(' + P.wind + ',' + w.a + ')');
      x.strokeStyle = g; x.lineWidth = 1.2; x.lineCap = 'round';
      x.beginPath(); x.moveTo(w.x - len, yy + len * 0.25); x.quadraticCurveTo(w.x - len * 0.5, yy + len * 0.05 - w.amp * 0.4, w.x, yy); x.stroke();
    });

    // partículas que suben
    dots.forEach(function (d) {
      d.y -= (d.sp + Math.max(0, boost) * 0.35) * dt; d.sw += 0.02 * dt; d.tw += 0.05 * dt;
      if (d.y < -10) newDot(d, false);
      var a = night ? 0.25 + 0.55 * Math.abs(Math.sin(d.tw)) : 0.22;
      x.fillStyle = 'rgba(' + P.dot + ',' + a + ')';
      x.beginPath(); x.arc(d.x + Math.sin(d.sw) * 8, d.y, d.r, 0, 6.283); x.fill();
    });

    // pájaros (de día y al atardecer)
    if (!night) {
      if (!flock.on) { flock.wait -= dt / 60; if (flock.wait <= 0) launchFlock(); }
      else {
        flock.x += flock.sp * 1.6 * dt; flock.y -= 0.12 * dt;
        flock.birds.forEach(function (b) { b.ph += 0.22 * dt; drawBird(flock.x + b.dx, flock.y + b.dy + Math.sin(b.ph * 0.3) * 2, b.ph, b.s, 'rgba(' + P.bird + ',.55)'); });
        if (flock.x > W + 200) { flock.on = false; flock.wait = 10 + R() * 12; }
      }
    }

    // avión de papel
    if (plane.t < 0) { plane.wait -= dt / 60; if (plane.wait <= 0) launchPlane(); }
    else {
      plane.t += (dt / 60) / plane.dur * (1 + Math.max(0, boost) * 0.08);
      var k = Math.min(1, plane.t);
      var px = bez(plane.p0.x, plane.p1.x, plane.p2.x, plane.p3.x, k), py = bez(plane.p0.y, plane.p1.y, plane.p2.y, plane.p3.y, k) + Math.sin(now / 400) * 3;
      var k2 = Math.min(1, k + 0.01), qx = bez(plane.p0.x, plane.p1.x, plane.p2.x, plane.p3.x, k2), qy = bez(plane.p0.y, plane.p1.y, plane.p2.y, plane.p3.y, k2);
      plane.trail.push([px, py]); if (plane.trail.length > 70) plane.trail.shift();
      x.setLineDash([3, 7]); x.lineWidth = 1.4; x.strokeStyle = 'rgba(' + P.wind + ',.35)';
      x.beginPath(); plane.trail.forEach(function (p, j) { j ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); x.stroke(); x.setLineDash([]);
      drawPlane(px, py, Math.atan2(qy - py, qx - px), P.plane);
      if (night && Math.sin(now / 160) > 0.6) { x.fillStyle = '#FF5A1F'; x.beginPath(); x.arc(px, py, 2.4, 0, 6.283); x.fill(); }
      if (plane.t >= 1) { plane.t = -1; plane.wait = 6 + R() * 8; }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
