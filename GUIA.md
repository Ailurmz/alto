# ALTO · Guía de la web

## Qué hay en cada carpeta

```
alto-web/
├── index.html          La web (estructura y textos fijos de cada piso)
├── 404.html            "Este piso no existe. Volvé a planta baja."
├── favicon.svg         Ícono de la pestaña (la A con la marca de altura)
├── css/styles.css      Todo el diseño: colores, tipografías, tamaños
├── js/data.js          ← EL ÚNICO ARCHIVO QUE TOCÁS PARA CAMBIAR CONTENIDO
├── js/main.js          Lógica y animaciones (no hace falta tocarlo)
├── js/sky.js           El cielo que pasa de día a noche (WebGL)
├── js/reel.js          La animación de proyectos dentro del sol
└── assets/
    ├── img/            Capturas de proyectos e imagen para compartir (og-alto.jpg)
    └── video/          Video del sol (opcional)
```

## Cambiar contenido sin tocar la lógica

Abrí `js/data.js` con cualquier editor (VS Code, o el editor de GitHub en el navegador).

| Qué querés cambiar | Dónde |
|---|---|
| WhatsApp, email, Instagram, TikTok | `contacto` |
| Palabras de la marquesina | `servicios` |
| Proyectos de La Torre | `proyectos` (uno por línea) |
| Precios, plazos y lo que incluye cada paquete a medida | `paquetes` |
| Plantillas listas para subir: precio, link a la demo y qué incluyen | `plantillas` |
| Opiniones de clientes | `opiniones` |
| Video adentro del sol | `videoSol` (ej. `"assets/video/reel-sol.mp4"`) |

**Para sumar un proyecto real:** copiá una línea de `proyectos`, cambiá los datos, poné la captura en `assets/img/` y escribí su ruta en `imagen`. Borrá `ejemplo: true` para que no aparezca la etiqueta "ejemplo". El proyecto más nuevo va arriba.

**Textos fijos** (títulos de cada piso, manifiesto, pasos de "Cómo trabajamos") están en `index.html`. Buscá el texto con Ctrl+F y reemplazalo.

Regla de oro: respetá las comillas, las comas y las llaves. Si algo deja de verse, casi siempre es una coma que falta.

## Publicarla

**Opción 1 · GitHub Pages (gratis, como Rommer)**
1. Creá un repositorio nuevo (ej. `alto-web`) y subí todo el contenido de esta carpeta.
2. Settings → Pages → Branch: `main` / carpeta `/root` → Save.
3. En unos minutos queda en `https://tuusuario.github.io/alto-web/`.
4. Para usar altoagencia.com: en Settings → Pages → Custom domain escribí `altoagencia.com`, y en NIC Argentina apuntá los DNS a GitHub Pages (registros A a 185.199.108.153, .109.153, .110.153 y .111.153).

**Opción 2 · Netlify (arrastrar y soltar)**
Entrá a app.netlify.com → "Add new site" → "Deploy manually" → arrastrá la carpeta. Después conectás el dominio desde "Domain settings".

**Opción 3 · Hosting con cPanel**
Subí todo a `public_html` con el administrador de archivos. Para que el 404 funcione, creá un archivo `.htaccess` con: `ErrorDocument 404 /404.html`

## Antes de lanzar (checklist)

- [ ] Número real de WhatsApp en `data.js` (formato `549` + área + número, sin espacios).
- [ ] Email e Instagram/TikTok reales.
- [ ] Proyectos y opiniones reales, sin `ejemplo: true`.
- [ ] Píxel de Meta y Google Analytics: en `index.html` están los lugares marcados con `PÍXEL DE META` y `GOOGLE ANALYTICS`. Pegá tu código y sacale los `<!--` `-->` del principio y del final.
- [ ] Probá el formulario desde tu celular: tiene que abrir WhatsApp con el mensaje armado.
- [ ] Probá la web con "reducir movimiento" activado en el celular: tiene que verse completa y sin animaciones.

## Imágenes y videos para producir

| Pieza | Medida | Formato y peso | Dónde va |
|---|---|---|---|
| Captura de cada proyecto (La Torre) | 1200 × 750 px | WebP, menos de 150 KB | `assets/img/`, campo `imagen` |
| Video del sol (reel de proyectos) | 1080 × 1080 px, 8 a 12 s en loop, sin audio | MP4 (H.264), menos de 2,5 MB | `assets/video/reel-sol.mp4`, campo `videoSol` |
| Antes y después real (opcional) | 1600 × 1000 px, dos capturas del mismo encuadre | WebP, menos de 200 KB cada una | reemplaza las maquetas del Piso 3 |
| Imagen para compartir (Open Graph) | 1200 × 630 px | JPG, menos de 300 KB | `assets/img/og-alto.jpg` (ya hay una de ejemplo) |
| Foto de la fundadora (opcional, para la Terraza) | 1080 × 1350 px vertical, luz de hora dorada | WebP, menos de 200 KB | — |
| Favicon | ya incluido (SVG) | — | `favicon.svg` |

**Para el video del sol:** grabá la pantalla haciendo scroll suave por 4 o 5 de tus webs, en vertical u horizontal, y recortalo cuadrado. El círculo y el degradé naranja los pone la web encima.

## Demos de las plantillas en subdominios

Las tres demos ya están enlazadas en `js/data.js` (campo `demo` de cada plantilla):
`landing.altoagencia.com`, `web.altoagencia.com` y `empresa.altoagencia.com`.

1. En tu hosting (cPanel) → **Subdominios** → creá `landing`, `web` y `empresa` sobre `altoagencia.com`.
2. En cada subdominio instalá WordPress (Softaculous lo hace en 2 clics) y cargá la plantilla con su contenido de ejemplo.
3. Si la web de ALTO está en GitHub Pages, en la zona DNS de `altoagencia.com` agregá un registro **A** para cada subdominio apuntando a la IP de tu hosting.
4. Para que nadie cambie la demo, no compartas el usuario administrador y desactivá el registro de usuarios.

Hasta que las demos estén publicadas, el botón "Ver demo" va a dar error: si querés, dejá `demo: ""` y el botón te lleva a la sección de plantillas.

## Precios y extras

- Webs a medida: `paquetes` en `js/data.js`.
- Plantillas: `plantillas` (precio) e `instalacion` (lo que cobrás por instalarla, hoy 20 USD).
- Extras (identidad de marca, mantenimiento, gestión de dominio y hosting): `extras`.
