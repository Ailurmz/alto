/* =========================================================
   ALTO · CONTENIDO EDITABLE
   ---------------------------------------------------------
   Este es el ÚNICO archivo que necesitás tocar para cambiar
   textos, proyectos, precios y datos de contacto.
   No hace falta saber programar: cambiá lo que está entre
   comillas y guardá. Respetá las comas y las llaves.
   ========================================================= */

window.ALTO = {

  /* ---------- CONTACTO ----------
     whatsapp: código de país + área + número, sin "+", sin espacios.
     Ejemplo Argentina: 54 9 11 2345 6789  ->  "5491123456789"          */
  contacto: {
    whatsapp: "5491140585229",          // 54 9 + área + número, sin espacios
    whatsappTexto: "+54 9 11 4058-5229",  // cómo se muestra en la web
    email: "altowebs.agencia@gmail.com",
    instagram: "altowebs.agencia",          // ← usuario sin @
    dominio: "altoagencia.com"
  },

  /* ---------- VIDEO DEL SOL (hero) ----------
     Si tenés un video de tus proyectos, poné la ruta acá
     (ej: "assets/video/reel-sol.mp4"). Si lo dejás vacío,
     la web genera una animación de proyectos automáticamente. */
  videoSol: "",

  /* ---------- SERVICIOS (marquesina) ---------- */
  servicios: [
    "Landings", "Webs", "UX/UI", "Plantillas a medida",
    "Identidad de marca", "Interacciones a medida", "Mobile first", "SEO base"
  ],

  /* ---------- LA TORRE (proyectos) ----------
     piso: número de 2 cifras. El más nuevo va primero.
     imagen: captura de la web (ej: "assets/img/lupe.webp"), 1200x750.
     link: dirección de la web publicada (o "" si no tiene).
     color: color de la tarjeta si todavía no tenés imagen.
     ejemplo: true = muestra la etiqueta "ejemplo". Poné false
     (o borralo) cuando cargues un proyecto real.                         */
  proyectos: [
    { piso: "05", cliente: "Rommer",          rubro: "Cuidado capilar", tipo: "Tienda online", anio: 2026, dias: "", link: "https://ailurmz.github.io/rommer-web-v5/", imagen: "rommer-1200.webp", color: "#CC3888" },
    { piso: "04", cliente: "RM Construcciones", rubro: "Construcción",  tipo: "Web",           anio: 2026, dias: "", link: "", imagen: "", color: "#121216" },  // ← pasame el link y el año
    { piso: "03", cliente: "Norte Fit",       rubro: "Gimnasio",        tipo: "Web",           anio: 2026, dias: 12, link: "", imagen: "", color: "#2B3BFF", ejemplo: true },
    { piso: "02", cliente: "Estudio Paz",     rubro: "Psicología",      tipo: "Landing",       anio: 2025, dias: 7,  link: "", imagen: "", color: "#FFC53D", ejemplo: true }
  ],


  /* ---------- CATÁLOGO DE DEMOS (piso 02 "Elegí tu web") ----------
     tipo: "landing", "web" o "empresa". slug: nombre del archivo demo-SLUG.html
     Para sumar una demo: copiá una línea, cambiá los datos y subí demo-SLUG.html y cat-SLUG.webp */
  tiposDemo: {
    landing: { nombre: "Landings", desde: "80", plazo: "Lista en 72 h", bajada: "Una sola página pensada para vender, lanzar o recibir reservas." },
    web:     { nombre: "Webs", desde: "150", plazo: "Lista en 5 días", bajada: "Tu negocio completo: quién sos, qué hacés, trabajos y contacto." },
    empresa: { nombre: "Empresariales", desde: "250", plazo: "Lista en 7 días", bajada: "Para pymes y empresas: servicios, proyectos, clientes y presupuestos." }
  },
  demos: [
    { tipo: "landing", slug: "estetica",     nombre: "Lumière",      rubro: "Estética y belleza" },
    { tipo: "landing", slug: "burger",       nombre: "Brasa",        rubro: "Gastronomía y delivery" },
    { tipo: "landing", slug: "auriculares",  nombre: "Aura",         rubro: "Lanzamiento de producto" },
    { tipo: "web",     slug: "psicologia",   nombre: "Sofía Marín",  rubro: "Psicología y salud" },
    { tipo: "web",     slug: "estudio",      nombre: "Ferrer",       rubro: "Estudio jurídico o contable" },
    { tipo: "web",     slug: "fotografia",   nombre: "Tomás Rey",    rubro: "Fotografía y creativos" },
    { tipo: "web",     slug: "gimnasio",     nombre: "Norte Fit",    rubro: "Gimnasio y entrenamiento" },
    { tipo: "empresa", slug: "constructora", nombre: "Cimientos",    rubro: "Constructora" },
    { tipo: "empresa", slug: "inmobiliaria", nombre: "Hábitat",      rubro: "Inmobiliaria" },
    { tipo: "empresa", slug: "logistica",    nombre: "Vía",          rubro: "Industria y logística" }
  ],

  /* ---------- PAQUETES ---------- */
  paquetes: [
    {
      id: "Express", nombre: "Express", pago: "50 % + 50 %", precio: "290", moneda: "USD", desde: false, plazo: "7 días",
      bajada: "Landing a medida. Directo al punto: una página pensada para vender y para hacer anuncios.",
      incluye: ["Hasta 7 secciones con diseño a medida", "WhatsApp flotante y formulario", "Píxel de Meta y Google Analytics instalados", "SEO base y carga rápida", "2 rondas de cambios y capacitación", "15 días de soporte"],
      destacado: false
    },
    {
      id: "Panorámico", nombre: "Panorámico", pago: "50 % + 50 %", precio: "490", moneda: "USD", desde: false, plazo: "10 días",
      bajada: "Web a medida. Todo tu negocio a la vista, en hasta 5 páginas. Incluye todo lo de Express.",
      incluye: ["Hasta 5 páginas", "Blog, galería o portfolio", "Google Maps y Google Business", "Avisos del formulario por email", "Píxel, Analytics y SEO base", "30 días de soporte"],
      destacado: true
    },
    {
      id: "Ejecutivo", nombre: "Ejecutivo", pago: "Hasta 3 cuotas", precio: "750", moneda: "USD", desde: false, plazo: "15 días",
      bajada: "Web empresarial a medida, para mostrar todo lo que hacés. Incluye todo lo de Panorámico.",
      incluye: ["Hasta 10 páginas: servicios, equipo, clientes y casos", "Formularios de presupuesto por área", "SEO en cada página", "Animaciones a medida", "Preparada para sumar tienda online", "60 días de soporte y prioridad"],
      destacado: false
    }
  ],

  /* ---------- EXTRAS (se suman a cualquier web a medida) ----------
     precio: texto tal cual se muestra.                                   */
  extras: [
    { nombre: "Identidad de marca", precio: "80 USD", detalle: "Logo, colores y tipografías. Hasta 3 propuestas según lo que nos pidas." },
    { nombre: "Mantenimiento mensual", precio: "50 USD/mes", detalle: "Actualizaciones, copias de seguridad y cambios chicos. Opcional: lo das de baja cuando quieras." },
    { nombre: "Gestión de dominio y hosting", precio: "10 USD", detalle: "Lo contratamos por vos, a tu nombre. Vos pagás directo al proveedor (unos 5 a 10 USD por mes)." },
    { nombre: "Tienda online, textos o idioma extra", precio: "A consultar", detalle: "Lo cotizamos según lo que necesites." }
  ],

  /* ---------- INSTALACIÓN DE PLANTILLAS ----------
     Lo que cuesta que ALTO instale la plantilla en lugar del cliente.   */
  instalacion: "20",

  /* ---------- PLANTILLAS LISTAS PARA SUBIR ----------
     precio: poné el número (ej: "149"). Si lo dejás vacío dice "Precio pronto".
     demo: link a la demo publicada. Cuando estén listas, poné:
       "https://landing.altoagencia.com", "https://web.altoagencia.com" y "https://empresa.altoagencia.com".
       Si lo dejás vacío, el botón dice "Demo pronto".
     estilo: "a", "b" o "c" (cambia el dibujo de la tarjeta).                  */
  plantillas: [
    { id: "Landing Lista", nombre: "Landing Lista", ideal: "lanzar un producto o servicio", precio: "80", moneda: "USD", demo: "demo-estetica.html", color: "#2B3BFF", estilo: "a",
      incluye: ["1 página de 6 secciones", "100 % editable desde WordPress", "Sumá plugins como WhatsApp o formularios", "Perfecta en celular", "Guía en PDF para editarla"] },
    { id: "Web Lista", nombre: "Web Lista", ideal: "emprendedores y profesionales", precio: "150", moneda: "USD", demo: "demo-psicologia.html", color: "#FF5A1F", estilo: "b",
      incluye: ["Hasta 5 páginas", "100 % editable desde WordPress", "Sumá plugins como WhatsApp, reservas o tienda", "Galería o blog", "Guía en PDF para editarla"] },
    { id: "Empresa Lista", nombre: "Empresa Lista", ideal: "pymes y empresas", precio: "250", moneda: "USD", demo: "demo-constructora.html", color: "#FFC53D", estilo: "c",
      incluye: ["Hasta 8 páginas: servicios, equipo, clientes", "100 % editable desde WordPress", "Lista para sumar tienda online", "Formularios de contacto y presupuesto", "Guía en PDF para editarla"] }
  ],

  /* ---------- OPINIONES ----------
     antes / despues: la "marca de altura" de cada cliente.
     ejemplo: true = muestra la etiqueta "ejemplo".                      */
  opiniones: [
    { texto: "Pasamos de 2 a 11 consultas por semana. La web se explica sola.", nombre: "Nombre del cliente", marca: "Marca · rubro", antes: "1,20", despues: "2,10", ejemplo: true },
    { texto: "La entregaron en 8 días y por primera vez me da orgullo pasar el link.", nombre: "Nombre del cliente", marca: "Marca · rubro", antes: "0,90", despues: "1,95", ejemplo: true },
    { texto: "Entendieron mi marca mejor que yo. Ahora parecemos una empresa grande.", nombre: "Nombre del cliente", marca: "Marca · rubro", antes: "1,05", despues: "2,05", ejemplo: true }
  ]
};
