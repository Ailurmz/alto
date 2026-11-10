/* =========================================================
   ALTO · ASISTENTE GUIADO ("el ascensor")
   Un chat con botones: hace 4 preguntas, recomienda qué le conviene
   al cliente y lo manda a WhatsApp con todo resumido.
   No usa inteligencia artificial ni servidores: solo dice lo que está acá.
   Para cambiar textos, opciones o precios, editá el bloque CONFIG.
   ========================================================= */
(function () {
  var CONFIG = {
    whatsapp: (window.ALTO && window.ALTO.contacto && window.ALTO.contacto.whatsapp) || '5491140585229',
    saludo: 'Hola, soy el ascensor de ALTO. Te ayudo a elegir tu web en 4 pasos.',
    aviso: '¿Te ayudo a elegir?',
    precios: { w72: '120', esencial: '60', pro: '80' },
    // rubro → plantilla sugerida (archivo demo-SLUG.html)
    rubros: [
      ['Gastronomía', 'burger'], ['Estética y belleza', 'estetica'], ['Salud y bienestar', 'psicologia'],
      ['Profesional (abogado, contador…)', 'estudio'], ['Deportes y gimnasios', 'gimnasio'],
      ['Construcción o inmobiliaria', 'constructora'], ['Fotografía y creativos', 'fotografia'], ['Otro rubro', '']
    ],
    // plantilla sugerida para "otro rubro", según lo que necesita
    porDefecto: { landing: 'auriculares', web: 'fotografia', empresa: 'logistica' },
    nombres: { burger: 'Brasa', estetica: 'Lumière', psicologia: 'Sofía Marín', estudio: 'Ferrer', gimnasio: 'Norte Fit', constructora: 'Cimientos', fotografia: 'Tomás Rey', auriculares: 'Aura', logistica: 'Vía', inmobiliaria: 'Hábitat' },

    // Frases con contexto: se revisan ANTES que las palabras clave, en este orden.
    // [expresión a buscar (sin tildes, en minúscula), respuesta]
    especiales: [
      // identidad de marca
      ['(no tengo|todavia no tengo|no tenemos|sin|me falta|necesito|quiero|hacen|arman|disenan|crean)( un| el| mi| una| la)? (logo|marca|identidad|branding)', 'La armamos con vos: logo, colores y tipografías, con hasta 3 propuestas. Y si querés todo junto, el pack Despegue completo suma identidad de marca, tu web y tus primeras 6 publicaciones para Instagram, con la misma estética.'],
      ['(ya )?(tengo|tenemos|cuento con)( mi| un| el| la| una)? (logo|marca|identidad|branding|manual de marca|colores)', '¡Genial! Si ya tenés tu identidad de marca, la aplicamos en tu web: usamos tu logo, tus colores y tus tipografías para que todo quede coherente. No tenés que pagar identidad aparte. Solo mandanos el logo (ideal en PNG o SVG), los colores y, si lo tenés, tu manual de marca.'],
      // dominio y hosting
      ['(no tengo|sin|me falta|necesito|no se que es)( un| el| mi)? (dominio|hosting|servidor)', 'Te ayudamos: el dominio es tu dirección web (tunegocio.com) y el hosting es donde vive la web. Los contratamos y configuramos a tu nombre, y vos los pagás directo al proveedor, unos 5 a 10 USD por mes.'],
      ['(ya )?(tengo|tenemos)( un| el| mi)? (dominio|hosting|servidor|wordpress)', '¡Perfecto! Usamos tu dominio y tu hosting, que siguen siendo tuyos. Solo necesitamos que tengan WordPress (o lo instalamos nosotros) y un acceso para publicar tu web.'],
      // ya tiene web
      ['(ya )?(tengo|tenemos)( una| mi)? (web|pagina|sitio)|mi (web|pagina|sitio) (actual|vieja)|renovar|redisen|cambiar mi (web|pagina)|mejorar mi (web|pagina)', 'Podemos renovarla: la pasamos a una Plantilla ALTO adaptada a tu marca (Web 72 h) o la rediseñamos a medida. Si tu dominio ya es tuyo, lo mantenemos, así no perdés tu dirección.'],
      // material
      ['(no tengo|sin|me faltan|no se que poner en los) (textos|fotos|imagenes|contenido)', 'No hay problema: si te faltan textos, los armamos con vos a partir de una charla corta. Y si te faltan fotos, usamos imágenes profesionales libres de derechos hasta que tengas las tuyas.'],
      ['(tengo que|necesito|hay que|debo) (mandar|pasar|enviar)|que (les|te) (mando|paso)|que necesitan de mi|para empezar que', 'Para arrancar necesitamos: tu logo (PNG o SVG), tus colores, entre 5 y 10 fotos y los textos (o te ayudamos a armarlos). Las 72 h cuentan desde que tenemos la seña y todo el material.'],
      // qué incluye / cambios
      ['que incluye|que trae|que viene', 'La Web 72 h incluye: plantilla adaptada a tu marca, botón de WhatsApp y formulario, Píxel de Meta y Google Analytics, SEO base, versión para celular, 1 ronda de ajustes, 15 días de soporte y el primer mes de mantenimiento de regalo.'],
      ['(no me gusta|si no me gusta|cambios|correcciones|ajustes|rondas|garantia)', 'Antes de pagar el 50 % final ves tu web terminada. La Web 72 h incluye 1 ronda de ajustes y las webs a medida, 2 rondas. Si la primera propuesta a medida no te convence, la rehacemos.'],
      // pagos
      ['factura|comprobante', 'Te enviamos comprobante de cada pago. Si necesitás factura, escribinos por WhatsApp y lo vemos según tu caso.'],
      ['(en )?pesos|tipo de cambio|cotizacion del dolar', 'Sí, podés pagar en pesos, tomando el valor del dólar del día del pago. Con Mercado Pago también podés pagar en cuotas con tarjeta.'],
      // plataformas
      ['wix|shopify|tiendanube|tienda nube|squarespace|webflow|elementor', 'Trabajamos con WordPress, que es tuyo, flexible y sin pagos mensuales de plataforma. Si vendés por Tiendanube o Shopify, tu web de ALTO puede llevar a tu tienda con botones y catálogo.'],
      ['(turno|turnos|reserva|reservas|agenda|calendly)', 'Sí: sumamos un botón de "Reservar" que lleva a tu agenda online (Google Calendar o Calendly, gratis) o a tu WhatsApp. Así tus clientes reservan sin llamarte.'],
      ['ingles|idioma|portugues|bilingue', 'Podemos sumar tu web en otro idioma. Se cotiza aparte según la cantidad de secciones: escribinos por WhatsApp.'],
      // ALTO
      ['(trabajos|ejemplos|portfolio|clientes|webs que hicieron|hicieron)', 'Mirá "Marcas que ya subieron" para ver webs reales que hicimos, y en Plantillas ALTO podés abrir cada demo y recorrerla como si fuera tuya.'],
      ['(donde estan|de donde son|ubicacion|zona|presencial|oficina|atienden en)', 'Somos de Buenos Aires y trabajamos 100 % online con todo Argentina y Latinoamérica. Todo se coordina por WhatsApp y videollamada.'],
      ['(persona|humano|alguien|hablar con|llamar|telefono|numero|email|mail|contacto)', 'Te atendemos personas reales 🙂 Escribinos por WhatsApp y te respondemos en el día.'],
      ['^(gracias|muchas gracias|genial|perfecto|ok|dale|buenisimo)', '¡De nada! Cuando quieras seguimos. Si ya sabés lo que querés, escribinos por WhatsApp y arrancamos.']
    ],
    // Preguntas frecuentes: [pregunta, respuesta, palabras clave que la activan cuando escriben]
    dudas: [
      ['¿Cuánto cuesta?', 'La Web 72 h (adaptamos una plantilla a tu marca y te la entregamos terminada, online en 72 horas) arranca en 120 USD. Si preferís armarla vos, las plantillas para descargar salen 60 USD (Esenciales) u 80 USD (Pro). Las webs a medida se cotizan según tu proyecto.', ['precio', 'cuesta', 'costo', 'valor', 'cuanto sale', 'cuanto es', 'presupuesto', 'cotiz', 'usd', 'dolar', 'barato', 'tarifa']],
      ['¿Cuánto tarda?', 'La Web 72 h queda online en 72 horas desde que tenemos la seña y tu material (logo, fotos y textos). Las webs a medida, entre 7 y 15 días. Las plantillas para descargar las tenés en el momento.', ['tarda', 'demora', 'dias', 'plazo', 'cuando', 'rapido', 'urgente', 'tiempo', 'entrega', '72']],
      ['¿Cómo pago? ¿Hay cuotas?', 'Mercado Pago (tarjeta en cuotas, débito o dinero en cuenta), transferencia o PayPal desde el exterior. En la Web 72 h pagás 50 % para arrancar y 50 % cuando la ves terminada.', ['pago', 'pagar', 'cuota', 'tarjeta', 'mercado pago', 'mercadopago', 'transferencia', 'paypal', 'seña', 'sena', 'efectivo', 'adelanto']],
      ['¿Qué diferencia hay entre editarla yo y que la armen ustedes?', 'Todas se pueden editar después desde WordPress. La diferencia es quién la arma: si la descargás, cargás vos los textos, las fotos y los colores (es la opción más económica). En la Web 72 h te la entregamos terminada, con tus textos finales y adaptada a tu marca. Y la web a medida se diseña desde cero, solo para vos.', ['diferencia', 'generica', 'plantilla', 'personaliz', 'a medida', 'armada', 'editar yo', 'hacerla yo', 'descargar', 'descarga']],
      ['¿Qué necesito para empezar?', 'Tu logo, tus colores y algunas fotos y textos. Si no tenés logo, armamos tu identidad de marca. Para publicarla necesitás dominio y hosting a tu nombre: si no tenés, te ayudamos a contratarlos.', ['necesito', 'empezar', 'arrancar', 'material', 'requisit', 'que hace falta', 'que tengo que']],
      ['¿Qué es el dominio y el hosting?', 'El dominio es la dirección de tu web (tunegocio.com) y el hosting es el lugar donde vive. Los dos van a tu nombre y los pagás directo al proveedor: unos 5 a 10 USD por mes. Si querés, los contratamos y configuramos por vos.', ['dominio', 'hosting', 'servidor', '.com', 'direccion web', 'alojamiento', 'hostinger']],
      ['¿Puedo editarla yo después?', 'Sí. Todas las webs se editan desde WordPress sin saber programar: textos, fotos, colores y secciones. Te damos una guía en PDF paso a paso.', ['editar', 'cambiar', 'modificar', 'actualizar', 'wordpress', 'autoadministr', 'yo mismo', 'yo misma']],
      ['¿No tengo logo, qué hago?', 'La armamos con vos: logo, colores y tipografías, con hasta 3 propuestas. Y si querés todo junto, el pack Despegue completo suma identidad de marca, tu web y tus primeras 6 publicaciones para Instagram.', ['logo', 'marca', 'identidad', 'branding', 'colores', 'tipografia', 'diseño de logo']],
      ['¿Puedo vender productos?', 'Sí: podemos sumar un catálogo con tus productos y un botón que abre el pedido en tu WhatsApp. Si necesitás una tienda completa con carrito, pagos y envíos, lo vemos según tu negocio.', ['tienda', 'carrito', 'ecommerce', 'e-commerce', 'vender', 'producto', 'catalogo', 'stock', 'envio']],
      ['¿Landing, web o empresarial? ¿Cuál elijo?', 'La landing es una sola página pensada para una sola acción (que te escriban o te compren): ideal para promos, lanzamientos y publicidad. La web muestra tu negocio completo en hasta 5 páginas: ideal si ofrecés varios servicios o querés aparecer en Google. La empresarial suma servicios por área, proyectos, clientes y equipo: ideal para empresas. Si dudás, escribinos y te recomendamos.', ['landing', 'diferencia entre', 'cual elijo', 'cual necesito', 'empresarial', 'institucional', 'una pagina', 'varias paginas', 'cuantas paginas', 'que es una landing', 'web completa']],
      ['¿Pro o Esencial?', 'Las Pro tienen animaciones y efectos de alto impacto, ideales para destacarte. Las Esenciales son más simples, igual de profesionales y perfectas para arrancar.', ['pro', 'esencial', 'basica', 'animacion', 'cual me conviene', 'recomend']],
      ['¿Necesito instalar plugins?', 'No. WhatsApp, formularios, Píxel de Meta, Google Analytics y SEO ya vienen incluidos.', ['plugin', 'complemento', 'instalar', 'elementor', 'woocommerce']],
      ['¿Aparezco en Google?', 'Sí: todas incluyen SEO base (descripción, imagen al compartir y datos para Google) y cargan rápido. También podemos armar tu perfil de Google Maps.', ['google', 'seo', 'buscador', 'aparecer', 'posicion', 'maps']],
      ['¿Me ayudan con Instagram?', 'Sí: el Kit de lanzamiento son tus primeras 6 publicaciones para Instagram, con tu marca y listas para subir. Y todas las webs vienen con el Píxel de Meta instalado, listas para hacer publicidad.', ['instagram', 'redes', 'publicacion', 'posteo', 'contenido', 'meta', 'anuncio', 'publicidad', 'facebook']],
      ['¿Y después de publicarla?', 'Tenés soporte incluido (15 días en la Web 72 h). Después podés sumar la Torre de control: mantenimiento mensual con cambios chicos, copias de seguridad y reporte. El primer mes es de regalo.', ['mantenimiento', 'soporte', 'despues', 'ayuda', 'actualizacion', 'backup', 'copia']]
    ]
  };

  if (document.getElementById('alto-asis')) return;
  var cur = document.currentScript, src = (cur && cur.src) || "";
  var DEMOS = /\/assets\/js\//.test(src) ? src.replace(/\/assets\/js\/.*$/, '/assets/demos/') : '';
  var TIPO = { landing: 'Landing', web: 'Web', empresa: 'Empresa' };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var track = function (ev) { try { if (window.gtag) gtag('event', ev, { method: 'asistente' }); if (window.fbq && ev === 'generate_lead') fbq('track', 'Contact'); } catch (e) {} };

  // ---------- estilos (todo acá, para que funcione en cualquier web) ----------
  var css = document.createElement('style');
  css.textContent = [
    '#alto-asis{--a:#2B3BFF;--c:#121216;--h:#F2EEE6;--g:#FFC53D;--b:#FF5A1F;position:fixed;right:16px;bottom:calc(var(--aa-b,112px) + env(safe-area-inset-bottom,0px));z-index:95;font-family:var(--body,system-ui,sans-serif);color:var(--c)}',
    '#alto-asis *{box-sizing:border-box}',
    '.aa-fab{width:62px;height:62px;border-radius:50%;border:0;background:var(--c);color:var(--h);cursor:pointer;display:grid;place-items:center;box-shadow:0 14px 34px -10px rgba(18,18,22,.55);transition:transform .4s cubic-bezier(.22,1,.36,1)}',
    '.aa-fab:hover{transform:translateY(-4px) rotate(-6deg)}',
    '.aa-fab svg{width:28px;height:28px}',
    '.aa-fab::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:2px solid var(--a);animation:aa-ring 2.4s infinite;pointer-events:none}',
    '@keyframes aa-ring{0%{opacity:.8;transform:scale(.9)}100%{opacity:0;transform:scale(1.35)}}',
    '.aa-tip{position:absolute;right:72px;bottom:12px;white-space:nowrap;background:var(--h);color:var(--c);border:1.5px solid var(--c);border-radius:14px 14px 4px 14px;padding:9px 30px 9px 13px;font-size:14px;font-weight:600;box-shadow:0 10px 30px -12px rgba(0,0,0,.4);opacity:0;transform:translateX(-8px);transition:opacity .4s,transform .4s;pointer-events:none}',
    '.aa-tip.is-on{opacity:1;transform:none;pointer-events:auto}',
    '.aa-tip button{position:absolute;right:6px;top:50%;transform:translateY(-50%);border:0;background:none;font-size:16px;cursor:pointer;color:inherit;padding:2px 6px}',
    '.aa-panel{position:absolute;right:0;bottom:76px;width:min(370px,calc(100vw - 32px));height:min(560px,calc(100svh - 120px));display:flex;flex-direction:column;background:var(--h);border:1.5px solid var(--c);border-radius:22px;overflow:hidden;box-shadow:0 30px 70px -20px rgba(18,18,22,.55);transform-origin:bottom right;transform:scale(.85) translateY(10px);opacity:0;visibility:hidden;transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .3s,visibility 0s .45s}',
    '#alto-asis.is-open .aa-panel{transform:none;opacity:1;visibility:visible;transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .3s}',
    '.aa-head{display:flex;align-items:center;gap:10px;padding:14px 16px;background:var(--c);color:var(--h)}',
    '.aa-head b{font-family:var(--display,Impact,sans-serif);font-weight:400;font-size:22px;letter-spacing:.02em;line-height:1;text-transform:uppercase}',
    '.aa-head span{font-family:var(--mono,monospace);font-size:11px;opacity:.7;display:block}',
    '.aa-floor{margin-left:auto;font-family:var(--mono,monospace);font-size:12px;background:var(--g);color:var(--c);padding:4px 8px;border-radius:8px}',
    '.aa-x{border:0;background:none;color:var(--h);font-size:22px;cursor:pointer;padding:0 4px;line-height:1}',
    '.aa-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}',
    '.aa-msg{max-width:88%;padding:11px 14px;border-radius:16px;font-size:14.5px;line-height:1.45;animation:aa-in .35s cubic-bezier(.22,1,.36,1)}',
    '.aa-bot{background:#fff;border:1px solid rgba(18,18,22,.1);border-bottom-left-radius:4px;align-self:flex-start}',
    '.aa-me{background:var(--a);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}',
    '.aa-msg strong{color:var(--a)}',
    '.aa-typing{display:flex;gap:4px;padding:14px}',
    '.aa-typing i{width:7px;height:7px;border-radius:50%;background:var(--c);opacity:.35;animation:aa-dot 1s infinite}',
    '.aa-typing i:nth-child(2){animation-delay:.15s}.aa-typing i:nth-child(3){animation-delay:.3s}',
    '@keyframes aa-dot{50%{opacity:1;transform:translateY(-3px)}}',
    '@keyframes aa-in{from{opacity:0;transform:translateY(8px)}}',
    '.aa-opts{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 16px}',
    '.aa-opts{max-height:46%;overflow-y:auto}',
    '.aa-ask{display:flex;gap:8px;padding:10px 12px;border-top:1px solid rgba(18,18,22,.12);background:#fff}',
    '.aa-ask input{flex:1;min-width:0;border:1.5px solid rgba(18,18,22,.2);border-radius:999px;padding:10px 14px;font:inherit;font-size:14px;background:var(--h);color:var(--c)}',
    '.aa-ask input:focus{outline:none;border-color:var(--a)}',
    '.aa-ask button{width:40px;height:40px;border-radius:50%;border:0;background:var(--a);color:#fff;font-size:18px;cursor:pointer;flex:none}',
    '.aa-note{font-size:12.5px;opacity:.75}',
    'a.aa-opt{text-decoration:none!important;display:inline-block}',
    '.aa-opt{border:1.5px solid var(--c);background:transparent;color:var(--c);border-radius:999px;padding:9px 14px;font-weight:600;font-size:13.5px;line-height:1.2;font-family:inherit;cursor:pointer;text-align:left;transition:background-color .25s,color .25s;animation:aa-in .35s cubic-bezier(.22,1,.36,1) both}',
    '.aa-opt:hover{background:var(--c);color:var(--h)}',
    '.aa-opt.is-main{background:var(--a);border-color:var(--a);color:#fff}',
    '.aa-opt small{display:block;font-weight:400;font-size:12px;opacity:.75;margin-top:3px}',
    '.aa-opt:hover small{opacity:.9}',
    '.aa-nav{display:flex;gap:6px;width:100%;margin-top:2px}',
    '.aa-opt.is-nav{border-style:dashed;font-size:12.5px;padding:7px 12px;opacity:.85}',
    '.aa-opt.is-wa{background:#25D366;border-color:#25D366;color:#fff}',
    '.aa-card{align-self:stretch;background:var(--c);color:var(--h);border-radius:16px;padding:16px;display:grid;gap:8px;font-size:14px;animation:aa-in .35s cubic-bezier(.22,1,.36,1)}',
    '.aa-card .aa-k{font-family:var(--mono,monospace);font-size:11px;color:var(--g)}',
    '.aa-card b{font-family:var(--display,Impact,sans-serif);font-weight:400;font-size:28px;line-height:1;text-transform:uppercase}',
    '.aa-card p{opacity:.85;margin:0}',
    '.aa-card a{color:var(--g)}',
    '@media (max-width:520px){#alto-asis{right:12px}.aa-panel{position:fixed;left:8px;right:8px;bottom:calc(var(--aa-b,112px) + 74px);width:auto;height:min(78svh,620px)}.aa-tip{display:none}}',
    '@media (prefers-reduced-motion:reduce){#alto-asis *{animation:none!important;transition:none!important}}'
  ].join('');
  document.head.appendChild(css);

  // ---------- estructura ----------
  var root = document.createElement('div'); root.id = 'alto-asis';
  root.innerHTML = '<div class="aa-panel" role="dialog" aria-label="Asistente de ALTO" aria-modal="false">' +
    '<div class="aa-head"><div><b>El ascensor</b><span>Asistente de ALTO · respondemos en el día</span></div><span class="aa-floor">PB</span><button class="aa-x" type="button" aria-label="Cerrar">×</button></div>' +
    '<div class="aa-log" aria-live="polite"></div><div class="aa-opts"></div>' +
    '<form class="aa-ask"><input type="text" placeholder="Escribí tu pregunta…" aria-label="Escribí tu pregunta" maxlength="200"><button type="submit" aria-label="Enviar">↑</button></form></div>' +
    '<div class="aa-tip" role="status"><span></span><button type="button" aria-label="Cerrar aviso">×</button></div>' +
    '<button class="aa-fab" type="button" aria-label="Abrir el asistente de ALTO" aria-expanded="false">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l4 5H8z" fill="currentColor"/><path d="M12 21l-4-5h8z" fill="currentColor" opacity=".45"/><path d="M4 12h16"/></svg></button>';
  document.body.appendChild(root);
  // la rueda del mouse y el dedo dentro del chat mueven solo el chat
  var panel = root.querySelector('.aa-panel');
  panel.setAttribute('data-lenis-prevent', '');
  ['wheel', 'touchmove'].forEach(function (ev) { panel.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); });
  // se ubica justo arriba del indicador de piso (abajo a la derecha)
  function place() { var el = document.querySelector('.elevator, .alto-elevator'), h = el ? el.offsetHeight : 0; root.style.setProperty('--aa-b', (h ? h + 28 : 16) + 'px'); }
  place(); addEventListener('resize', place); addEventListener('scroll', place, { passive: true }); [500, 1500, 4000].forEach(function (t) { setTimeout(place, t); });
  var $ = function (s) { return root.querySelector(s); };
  var log = $('.aa-log'), opts = $('.aa-opts'), fab = $('.aa-fab'), tip = $('.aa-tip'), floor = $('.aa-floor');
  tip.querySelector('span').textContent = CONFIG.aviso;

  var st = {}, started = false;
  function scroll() { log.scrollTop = log.scrollHeight; }
  function say(html, cb, delay) {
    var t = document.createElement('div'); t.className = 'aa-msg aa-bot aa-typing'; t.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(t); scroll();
    setTimeout(function () { t.className = 'aa-msg aa-bot'; t.innerHTML = html; scroll(); if (cb) cb(); }, delay || 650);
  }
  function me(text) { var m = document.createElement('div'); m.className = 'aa-msg aa-me'; m.textContent = text; log.appendChild(m); scroll(); }
  var hist = [];
  function step(fn) { hist.push(fn); fn(); }
  function back() { hist.pop(); var prev = hist.pop(); step(prev || menu); }
  function home() { hist = []; st = {}; step(menu); }
  function ask(list) {
    opts.innerHTML = '';
    if (hist.length > 1) list = list.concat([{ t: '← Volver', cls: 'is-nav', go: back }, { t: 'Menú principal', cls: 'is-nav', go: home }]);
    list.forEach(function (o, i) {
      var b = document.createElement(o.href ? 'a' : 'button'); b.className = 'aa-opt' + (o.cls ? ' ' + o.cls : ''); b.style.animationDelay = (i * 60) + 'ms';
      if (o.sub) { b.innerHTML = esc(o.t) + '<small>' + esc(o.sub) + '</small>'; } else b.textContent = o.t;
      if (o.href) { b.href = o.href; b.target = '_blank'; b.rel = 'noopener'; b.addEventListener('click', function () { if (o.lead) track('generate_lead'); }); }
      else { b.type = 'button'; b.addEventListener('click', function () { opts.innerHTML = ''; if (!o.silent) me(o.t); o.go(); }); }
      opts.appendChild(b);
    });
    scroll(); setTimeout(scroll, 80);
  }
  var wa = function (m) { return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(m); };

  // ---------- conversación ----------
  var dCual = CONFIG.dudas.filter(function (d) { return /^¿Landing/.test(d[0]); })[0];
  var dDif = CONFIG.dudas.filter(function (d) { return /editarla yo/.test(d[0]); })[0];
  var dHost = CONFIG.dudas.filter(function (d) { return /dominio y el hosting/.test(d[0]); })[0];
  function inicio() {
    hist = []; st = {};
    say(esc(CONFIG.saludo), function () { step(menu); }, 450);
  }
  // 1 · qué tipo de web
  function menu() {
    floor.textContent = 'PB';
    say('¿Qué estás buscando? <span class="aa-note">Elegí una opción o escribime tu pregunta abajo.</span>', function () {
      ask([
        { t: 'Landing', sub: 'Una sola página para vender, promocionar o tomar turnos', go: function () { st.tipo = 'landing'; step(modo); } },
        { t: 'Web', sub: 'Tu negocio completo: servicios, trabajos y contacto', go: function () { st.tipo = 'web'; step(modo); } },
        { t: 'Web empresarial', sub: 'Para pymes y empresas: áreas, proyectos y clientes', go: function () { st.tipo = 'empresa'; step(modo); } },
        { t: 'No sé cuál necesito', go: function () { say(esc(dCual[1]), function () { hist.pop(); step(menu); }, 900); } },
        { t: 'Tengo una duda', go: function () { step(dudas); } }
      ]);
    });
  }
  // 2 · quién la arma
  function modo() {
    floor.textContent = '01';
    say('¿Cómo la querés? <span class="aa-note">Todas se pueden editar después. La diferencia es quién la arma.</span>', function () {
      ask([
        { t: 'Te la armamos (online en 72 h)', sub: 'ALTO adapta una plantilla a tu marca, con tus textos y fotos. Online en 72 h', go: function () { st.modo = 'w72'; step(rubro); } },
        { t: 'La armo yo (plantilla para descargar)', sub: 'Descargás la plantilla y cargás vos tus textos y fotos. La más económica', go: function () { st.modo = 'dl'; step(rubro); } },
        { t: 'Diseño único, a medida', sub: 'Diseñada desde cero, solo para tu marca', go: function () { st.modo = 'medida'; step(rubro); } },
        { t: '¿Cuál me conviene?', go: function () { say(esc(dDif[1]), function () { hist.pop(); step(modo); }, 900); } }
      ]);
    });
  }
  // 3 · rubro
  function rubro() {
    floor.textContent = '02';
    say('¿De qué rubro es tu negocio?', function () {
      ask(CONFIG.rubros.map(function (r) { return { t: r[0], go: function () { st.rubro = r[0]; st.demo = r[1] || CONFIG.porDefecto[st.tipo]; step(extra); } }; }));
    });
  }
  // 4 · hosting (si la arma) o logo (si se la armamos)
  function extra() {
    floor.textContent = '03';
    if (st.modo === 'dl') {
      say('Para publicarla necesitás dominio y hosting con WordPress. ¿Ya los tenés?', function () {
        ask([
          { t: 'Sí, ya tengo', go: function () { st.hosting = 'tengo'; step(cuando); } },
          { t: 'No, necesito ayuda con eso', go: function () { st.hosting = 'ayuda'; step(cuando); } },
          { t: '¿Qué es eso?', go: function () { say(esc(dHost[1]), function () { hist.pop(); step(extra); }, 900); } }
        ]);
      });
    } else {
      say('¿Ya tenés logo e identidad de marca (colores, tipografías)?', function () {
        ask([
          { t: 'Sí, ya tengo', go: function () { st.marca = true; step(cuando); } },
          { t: 'No, todavía no', sub: 'Te la armamos junto con tu web', go: function () { st.marca = false; step(cuando); } }
        ]);
      });
    }
  }
  // 5 · cuándo
  function cuando() {
    floor.textContent = '04';
    say('Última: ¿para cuándo la necesitás?', function () {
      ask([
        { t: 'Lo antes posible', go: function () { st.cuando = 'lo antes posible'; step(final); } },
        { t: 'Este mes', go: function () { st.cuando = 'este mes'; step(final); } },
        { t: 'Sin apuro, estoy averiguando', go: function () { st.cuando = 'sin apuro'; step(final); } }
      ]);
    });
  }
  function final() {
    floor.textContent = 'T';
    var tipo = TIPO[st.tipo], titulo, txt, msg;
    var nombreDemo = CONFIG.nombres[st.demo] || st.demo, demoUrl = DEMOS + 'demo-' + st.demo + '.html';
    if (st.modo === 'w72' && st.marca) {
      titulo = tipo + ' 72 h'; txt = 'Adaptamos la plantilla a tu marca y te la entregamos terminada, con tus textos y fotos, online en 72 horas. Desde ' + CONFIG.precios.w72 + ' USD: 50 % al empezar y 50 % al final.';
      msg = 'Hola ALTO, quiero una ' + titulo + ' para mi negocio (' + st.rubro + '). Ya tengo logo e identidad. Me gustó la plantilla ' + nombreDemo + '.';
    } else if (st.modo === 'w72') {
      titulo = 'Despegue completo'; txt = 'Armamos tu identidad de marca, tu ' + tipo.toLowerCase() + ' terminada con tus textos y tus primeras 6 publicaciones para Instagram, todo con la misma estética y a un precio especial.';
      msg = 'Hola ALTO, quiero el pack Despegue completo: identidad de marca + ' + tipo.toLowerCase() + ' + 6 publicaciones. Mi rubro: ' + st.rubro + '. Me gustó la plantilla ' + nombreDemo + '.';
    } else if (st.modo === 'dl') {
      titulo = 'Plantilla para descargar'; txt = 'La descargás y cargás vos tus textos, fotos y colores en WordPress, con guía en PDF. Esenciales ' + CONFIG.precios.esencial + ' USD, Pro ' + CONFIG.precios.pro + ' USD.' + (st.hosting === 'tengo' ? '' : ' Te ayudamos a contratar tu dominio y hosting.');
      msg = 'Hola ALTO, quiero descargar una plantilla (' + tipo + ') para mi negocio (' + st.rubro + '). Me gustó ' + nombreDemo + '.' + (st.hosting === 'tengo' ? ' Ya tengo dominio y hosting.' : ' Necesito ayuda con el dominio y el hosting.');
    } else {
      titulo = tipo + ' a medida'; txt = 'Diseñada desde cero, solo para tu marca.' + (st.marca ? '' : ' Y sumamos tu identidad de marca.') + ' Contanos tu proyecto y te mandamos una propuesta en 24 horas.';
      msg = 'Hola ALTO, quiero una ' + titulo.toLowerCase() + ' para mi negocio (' + st.rubro + ').' + (st.marca ? ' Ya tengo logo e identidad.' : ' No tengo logo todavía.');
    }
    msg += ' La necesito: ' + st.cuando + '.';
    say('¡Listo! Esto es lo que te recomendamos:', function () {
      var c = document.createElement('div'); c.className = 'aa-card';
      c.innerHTML = '<span class="aa-k">Tu piso ideal</span><b>' + esc(titulo) + '</b><p>' + esc(txt) + '</p><p>Plantilla sugerida para tu rubro: <a href="' + esc(demoUrl) + '" target="_blank" rel="noopener">' + esc(nombreDemo) + ' ↗</a></p>';
      log.appendChild(c); scroll(); track('asistente_recomendacion');
      say('Escribinos por WhatsApp y te respondemos en el día. El mensaje ya va armado.', function () {
        ask([
          { t: 'Seguir por WhatsApp →', cls: 'is-wa', href: wa(msg), lead: true },
          { t: 'Ver la plantilla ' + nombreDemo, cls: 'is-main', href: demoUrl },
          { t: 'Tengo una duda', go: function () { step(dudas); } }
        ]);
      });
    });
  }
  // respuesta a una duda + qué hacer después
  function responder(d) {
    say(esc(d[1]), function () {
      ask([
        { t: 'Preguntar otra cosa por WhatsApp →', cls: 'is-wa', href: wa('Hola ALTO, tengo una duda: '), lead: true },
        { t: 'Quiero elegir mi web', go: home }
      ]);
    }, 900);
  }
  function dudas() {
    floor.textContent = '07';
    say('Elegí tu duda o escribila abajo:', function () {
      var list = CONFIG.dudas.slice(0, 9).map(function (d) { return { t: d[0], go: function () { step(function () { responder(d); }); } }; });
      if (document.getElementById('dudas')) list.push({ t: 'Ver todas las preguntas frecuentes', cls: 'is-main', silent: true, go: function () {
        close(); var nav = document.querySelector('a[href="#dudas"]'); if (nav) nav.click(); else document.getElementById('dudas').scrollIntoView({ behavior: 'smooth' });
      } });
      ask(list);
    });
  }

  // ---------- preguntas escritas: busca palabras clave ----------
  var norm = function (t) { return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:]/g, ' '); };
  function buscar(q) {
    var t = norm(q).replace(/\s+/g, ' ').trim();
    for (var i = 0; i < (CONFIG.especiales || []).length; i++) {
      var e = CONFIG.especiales[i];
      if (new RegExp(e[0]).test(t)) return [q, e[1]];
    }
    var n = ' ' + t + ' ', best = null, score = 1;
    CONFIG.dudas.forEach(function (d) {
      var sc = 0; (d[2] || []).forEach(function (k) { if (n.indexOf(norm(k)) > -1) sc += norm(k).length > 4 ? 2 : 1; });
      if (sc > score) { score = sc; best = d; }
    });
    return best;
  }
  $('.aa-ask').addEventListener('submit', function (e) {
    e.preventDefault();
    var inp = this.querySelector('input'), q = inp.value.trim(); if (!q) return;
    inp.value = ''; opts.innerHTML = ''; me(q); track('asistente_pregunta');
    if (/^(hola|buenas|buen dia|buenas tardes|buenas noches)\b/.test(norm(q).trim()) && q.length < 25) {
      say('¡Hola! ¿En qué te ayudo?', function () { home(); }); return;
    }
    var d = buscar(q);
    if (d) { step(function () { responder(d); }); return; }
    say('Mmm, esa no la tengo. Mandala por WhatsApp y te respondemos en el día: el mensaje ya va armado.', function () {
      ask([
        { t: 'Preguntar por WhatsApp →', cls: 'is-wa', href: wa('Hola ALTO, tengo una pregunta: ' + q), lead: true },
        { t: 'Ver preguntas frecuentes', go: function () { step(dudas); } },
        { t: 'Quiero elegir mi web', go: home }
      ]);
    });
  });

  // ---------- abrir / cerrar ----------
  function open() {
    root.classList.add('is-open'); fab.setAttribute('aria-expanded', 'true'); tip.classList.remove('is-on');
    try { sessionStorage.setItem('aa-tip', '1'); } catch (e) {}
    if (!started) { started = true; inicio(); track('asistente_abierto'); }
  }
  function close() { root.classList.remove('is-open'); fab.setAttribute('aria-expanded', 'false'); }
  fab.addEventListener('click', function () { root.classList.contains('is-open') ? close() : open(); });
  $('.aa-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  tip.addEventListener('click', function (e) { if (e.target.tagName === 'BUTTON') { tip.classList.remove('is-on'); try { sessionStorage.setItem('aa-tip', '1'); } catch (x) {} } else open(); });
  // el aviso aparece una vez por visita, a los 8 segundos
  var seen = false; try { seen = !!sessionStorage.getItem('aa-tip'); } catch (e) {}
  if (!seen) setTimeout(function () { if (!root.classList.contains('is-open')) tip.classList.add('is-on'); }, 8000);
  // cualquier link a #asistente lo abre
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href="#asistente"]'); if (a) { e.preventDefault(); open(); } });
})();
