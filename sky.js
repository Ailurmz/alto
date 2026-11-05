/* =========================================================
   ALTO · CIELO GENERATIVO (WebGL, sin librerías)
   ---------------------------------------------------------
   - Pasa de día (0) a atardecer (0.5) a noche (1) según el piso.
   - Tiene grano y una luz cálida que sigue al cursor.
   - En celular se dibuja a menor resolución y sin seguir el dedo.
   - Si el equipo es lento, sin WebGL o con "reducir movimiento",
     se apaga y queda el color de respaldo (.sky-fallback).
   Uso desde main.js:  ALTO_SKY.setTarget(0 | 0.5 | 1)
   ========================================================= */
(function () {
  var canvas = document.getElementById("sky");
  var api = { setTarget: function () {}, active: false };
  window.ALTO_SKY = api;
  if (!canvas) return;

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = matchMedia("(pointer: coarse)").matches;
  var gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl || reduced) { canvas.classList.add("is-off"); return; }

  var VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FRAG = [
    "precision mediump float;",
    "uniform vec2 r;uniform float t;uniform vec2 m;uniform float s;",
    "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
    " return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
    "vec3 sky(float k,vec3 a,vec3 b,vec3 c){return k<.5?mix(a,b,k*2.):mix(b,c,(k-.5)*2.);}",
    "void main(){",
    " vec2 uv=gl_FragCoord.xy/r;",
    // arriba / abajo para día, atardecer y noche (colores del manual)
    " vec3 top=sky(s,vec3(.949,.933,.902),vec3(.965,.80,.60),vec3(.043,.051,.165));",
    " vec3 bot=sky(s,vec3(.975,.935,.86),vec3(1.,.66,.44),vec3(.10,.08,.21));",
    " float w=n(uv*vec2(2.2,3.)+vec2(t*.025,t*.018))*.6+n(uv*6.+t*.04)*.4;",
    " vec3 col=mix(bot,top,smoothstep(-.1,1.1,uv.y+(w-.5)*.35));",
    // luz cálida que sigue al cursor
    " float ar=r.x/r.y;vec2 q=(uv-m)*vec2(ar,1.);float d=dot(q,q);",
    " vec3 gc=mix(vec3(1.,.77,.24),vec3(1.,.35,.12),s);",
    " col+=gc*exp(-d*5.)*(.08+.20*s);",
    // grano
    " col+=(h(gl_FragCoord.xy+fract(t*7.)*91.)-.5)*.045;",
    " gl_FragColor=vec4(col,1.);",
    "}"
  ].join("\n");

  function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; }
  var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { canvas.classList.add("is-off"); return; }
  var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { canvas.classList.add("is-off"); return; }
  gl.useProgram(pr);
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t"), uM = gl.getUniformLocation(pr, "m"), uS = gl.getUniformLocation(pr, "s");

  // resolución baja a propósito: el cielo es suave y así rinde en cualquier equipo
  var scale = coarse ? 0.3 : 0.5;
  function resize() { canvas.width = Math.max(2, Math.round(innerWidth * scale)); canvas.height = Math.max(2, Math.round(innerHeight * scale)); gl.viewport(0, 0, canvas.width, canvas.height); }
  resize(); addEventListener("resize", resize);

  var mx = .72, my = .7, tx = mx, ty = my, sNow = 0, sTarget = 0;
  if (!coarse) addEventListener("pointermove", function (e) { tx = e.clientX / innerWidth; ty = 1 - e.clientY / innerHeight; }, { passive: true });
  api.setTarget = function (v) { sTarget = v; };
  api.active = true;

  // control de rendimiento: si los primeros 90 cuadros van lentos, se apaga
  var frames = 0, slow = 0, last = performance.now(), t0 = last, running = true, minGap = coarse ? 33 : 0, prevDraw = 0;
  document.addEventListener("visibilitychange", function () { running = !document.hidden; if (running) { last = performance.now(); requestAnimationFrame(loop); } });

  function loop(now) {
    if (!running) return;
    var dt = now - last; last = now;
    if (frames < 90) { frames++; if (dt > 45) slow++; if (frames === 90 && slow > 30) { canvas.classList.add("is-off"); api.active = false; return; } }
    if (now - prevDraw >= minGap) {
      prevDraw = now;
      mx += (tx - mx) * .06; my += (ty - my) * .06; sNow += (sTarget - sNow) * .045;
      gl.uniform2f(uR, canvas.width, canvas.height); gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform2f(uM, mx, my); gl.uniform1f(uS, sNow);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
