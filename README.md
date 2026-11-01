# Portafolio Yojhan Furuya — v3

Tu tema de WordPress (`portafolio-wp`) convertido a sitio estático. Tiene el mismo diseño, los mismos
efectos y las mismas páginas, pulido y más liviano. No necesita PHP, base de datos ni cPanel:
se publica gratis en Vercel, Netlify o GitHub Pages.

```
portafolio-v3/
├── build.js                 ← genera el sitio (las plantillas PHP pasadas a JS)
├── src/
│   ├── data/proyectos.js    ← TODO el contenido de los proyectos (reemplaza el panel de WordPress)
│   ├── data/sitio.js        ← email, redes, URL final del sitio
│   ├── css/01…08-*.css      ← estilos por sección (se unen y minifican al compilar)
│   ├── js/main.js           ← cursor, nav blob, panel de contacto, galerías, timeline, carrusel…
│   ├── img/                 ← moodboard.webp (+ tu foto: foto-perfil.webp)
│   ├── uploads/             ← tus imágenes de WordPress (las baja el script)
│   └── cv/                  ← cv-yojhan-furuya.pdf
├── scripts/descargar-imagenes.js
└── dist/                    ← EL SITIO LISTO. Esta carpeta es la que se publica.
```

---

## 1. Antes de que cierre el cPanel: baja tus imágenes (5 min)

Requisito: Node 18 o superior (`node -v`).

```bash
cd portafolio-v3
npm install          # instala esbuild, bootstrap-icons y sharp (solo para compilar)
npm run imagenes     # baja ~40 imágenes + el video a src/uploads/ y crea versiones .webp livianas
npm run build        # regenera dist/
```

Mientras no las bajes, el sitio las sigue cargando desde el cPanel (hay un respaldo automático).
Cuando el cPanel cierre, en `src/data/sitio.js` deja `respaldoImagenes: ''` y vuelve a correr `npm run build`.

## 2. Tu foto y tu CV

- Foto para "Sobre mí": guárdala como `src/img/foto-perfil.webp` (o .jpg/.png). Recórtala con fondo
  transparente o oscuro, vertical, de unos 1000 px de alto. En tu sitio actual esa foto no estaba
  subida, por eso el hero de "Sobre mí" se veía vacío al centro.
- CV: guárdalo como `src/cv/cv-yojhan-furuya.pdf`. Los botones "Descargar CV" aparecen solos.

Después: `npm run build`.

## 3. Verlo en tu PC

```bash
npm run dev      # compila y abre http://localhost:3000
```
También sirve la extensión Live Server de VS Code, abriendo `dist/index.html`.
(Abrir el archivo con doble clic no funciona bien: los íconos y los enlaces entre páginas necesitan un servidor.)

## 4. Publicar gratis (Vercel, recomendado)

1. Sube la carpeta `portafolio-v3` a un repo nuevo en github.com/yojhan-caro (el `.gitignore` ya excluye `node_modules`).
2. En vercel.com → Add New → Project → elige el repo.
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy. Queda en `algo.vercel.app`. Copia esa URL en `src/data/sitio.js` → `url`, vuelve a publicar
   (con eso se generan sitemap.xml, robots.txt y las etiquetas para LinkedIn/WhatsApp).

Netlify funciona igual (Build command `npm run build`, Publish directory `dist`).
Sin Git: arrastra la carpeta `dist` a app.netlify.com/drop.

## 5. Editar contenido

- **Nuevo proyecto:** copia un bloque en `src/data/proyectos.js`, cambia `slug`, textos e imágenes.
  `grupo: 'universidad' | 'propio' | 'experimento'` decide en qué sección aparece.
  `destacado: 1, 2 o 3` lo pone en "Proyectos con impacto real" del inicio.
- **Botones a demo o repositorio:** agrega en el proyecto
  `links: [{ label: 'Ver demo', url: 'https://…' }, { label: 'Código en GitHub', url: 'https://…' }]`.
  Es lo que más valoran los reclutadores; agrégalo donde tengas algo publicado.
- **Colores, radios, tipografías:** variables en `src/css/01-base.css` (`:root`).

---

## Qué cambió respecto al tema WordPress

**Se mantiene (mismo código, ordenado):** el nav con blob líquido que viaja entre páginas, el cursor blob
deformable, el panel de contacto que se abre en curva desde la esquina, el menú móvil con revelado circular,
el zoom + blur al hacer clic en cards, las galerías con lightbox, el swipe y el teclado, la línea de tiempo con blob,
el carrusel de experimentos, las barras de nivel, el contador de cifras, el video con portada
y todas las páginas y secciones.

**Nuevo:**
- Transición suave entre páginas (View Transitions). El nav queda fijo mientras cambia el contenido.
- Revelado al hacer scroll propio, que reemplaza a la librería AOS.
- Accesibilidad:
  - Menú, panel de contacto y galerías se pueden usar con teclado, y Esc los cierra.
  - Contorno de foco visible.
  - Se respeta "reducir movimiento".
  - El cursor del sistema solo se oculta cuando hay mouse.

**Más minimalista, misma línea:**
- Brillos y gradientes de fondo a la mitad.
- Superficies planas en vez de degradados en cada card.
- Una sola escala de radios (28/22/16/12).
- Pesos tipográficos más contenidos.
- Movimientos de hover más cortos.
- Íconos de las cards en chips tintados en vez de bloques con degradado.

**Responsive:**
- Las imágenes de las cards usan proporción fija en vez de alturas en px.
- En móvil el inicio muestra tus redes (antes se ocultaba toda la columna derecha).
- El botón "volver arriba" ya no queda encima del botón de contacto.
- El menú móvil se abre desde el botón, no desde la esquina opuesta.
- Márgenes seguros en iPhone (notch).
- Cifras en 2 columnas en el teléfono.

**Rendimiento:**

| | Antes | Ahora |
|---|---|---|
| Bootstrap | 314 KB | — |
| Bootstrap Icons | 98 KB de fuente | sprite SVG con solo los ~60 íconos usados |
| AOS | 40 KB | — |
| CSS propio | 117 KB + 15 KB inline por página | 73 KB minificado (14 KB comprimido) |
| Moodboard | 1,9 MB (PNG) | 55 KB (WebP) |

Además, las capturas se convierten a WebP con el script de imágenes.

**Bugs corregidos del tema:**
- La línea de tiempo de "Sobre mí" heredaba los estilos de la de proyectos y quedaba al 38 % de opacidad.
- La tira de cifras de cada experimento no tenía grilla (el problema de `.stats-strip` fuera de `.project-hero`).
- La portada del inicio apuntaba a una imagen de Comandas que ya no existe (404).
- La foto de "Sobre mí" no estaba en el servidor (404).
- Las insignias de Drake y Comandas estaban cruzadas ("Proyecto propio" y "Trabajo de la U").

**Contenido corregido:**
- Comandas decía "13 endpoints / 5 tablas" en las cifras y "35+ endpoints / 7 tablas" en el texto. Quedó 35+ y 7.
- "Accesbilidad" → "Accesibilidad".
- Los módulos y fases de la auditoría estaban partidos en pares título/descripción sueltos.
- Drake pasó de "Trabajo perdido" a "Archivado".
- Comandas pasó de "Prototipo" a "En implementación".
- Selección destacada del inicio: Comandas, Ale.ink y TodoPSN (los que usan clientes reales).
