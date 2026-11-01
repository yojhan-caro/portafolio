/* ══════════════════════════════════════════════════════════════
   CONTENIDO DE LOS PROYECTOS
   Reemplaza al panel "Detalles del proyecto" de WordPress.
   Edita aquí y corre:  npm run build

   grupo:     'universidad' | 'propio' | 'experimento'
   destacado: aparece en "Proyectos con impacto real" (inicio)
   imágenes:  rutas dentro de src/uploads/ (misma estructura que wp-content/uploads)
   stats:     [número, texto]  → el número puede llevar + o % (ej. '35+')
   features / timeline: [título, descripción, archivo opcional]
   tech:      [nombre, para qué se usó]
   futuro:    [icono de Bootstrap Icons, título, descripción]
   ══════════════════════════════════════════════════════════════ */

export const PROYECTOS = [
  {
    slug: 'sistema-de-comandas',
    titulo: 'Sistema de Comandas',
    grupo: 'propio',
    destacado: 1,
    kicker: 'Sistema web · Restaurante',
    desc: 'Sistema de comandas multirrol para restaurantes con tres paneles independientes: garzón, cocina y administrador. Gestiona pedidos en tiempo real, historial, stock, personal y reportes desde una sola plataforma con login unificado por roles.',
    descCorta: 'Pedidos en tiempo real entre garzones, cocina y administración, con reportes, stock y personal.',
    tags: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS', 'REST API'],
    anio: '2025 – 2026',
    estado: 'En implementación',
    video: 'uploads/2026/07/Sin-titulo-1918-x-910-px-1-1.mp4',
    portada: 'uploads/2026/07/5b9e926b-052e-4389-a838-56a008209eb7.jpeg',
    galeria: [
      'uploads/2026/07/5b9e926b-052e-4389-a838-56a008209eb7.jpeg',
      'uploads/2026/07/Gemini_Generated_Image_olz0k8olz0k8olz0.png',
      'uploads/2026/07/Captura-de-pantalla-2026-07-12-140209.png',
      'uploads/2026/07/Captura-de-pantalla-2026-07-12-140258.png',
      'uploads/2026/07/Captura-de-pantalla-2026-07-12-140316.png',
      'uploads/2026/07/Captura-de-pantalla-2026-07-12-140324.png',
      'uploads/2026/07/screencapture-localhost-pulso-saas-saas-v5-garzon-index-php-2026-07-12-14_08_36.png'
    ],
    stats: [
      ['3', 'paneles independientes por rol'],
      ['35+', 'endpoints REST en PHP'],
      ['4', 'segundos de actualización en tiempo real'],
      ['7', 'tablas relacionales en MySQL']
    ],
    problema: 'Los restaurantes gestionan sus pedidos de forma manual: comandas en papel, comunicación verbal entre garzón y cocina, y cierres de caja sin registro. Esto genera errores, pérdida de información y tiempos muertos que afectan directamente la operación y la experiencia del cliente.',
    solucion: 'Un sistema web multirrol con login unificado que redirige a cada usuario a su panel según su rol. El garzón toma pedidos con detalle por producto, cantidad y nota; la cocina los recibe en tiempo real con timers de alerta; y el administrador accede a un panel completo con dashboard de KPIs, reportes, historial, gestión de menú, stock y personal.',
    resultado: [
      'Sistema operativo con 3 paneles independientes para garzón, cocina y administrador',
      'Login unificado con 4 roles: garzón, cocina, cajero y administrador',
      'Dashboard con KPIs en tiempo real: pedidos del día, tiempo promedio de preparación, mesas activas y alertas de stock',
      'Reportes filtrables por fecha con análisis de pedidos por día, horas pico, productos top y rendimiento por garzón',
      'Gestión completa de menú con categorías, productos, disponibilidad y stock',
      'Historial exportable en CSV con tiempos de apertura, cierre y preparación por mesa'
    ],
    demuestra: [
      'Arquitectura multirrol con autenticación PHP por sesión',
      'Backend con más de 35 endpoints REST en PHP',
      'Diseño de base de datos relacional con 7 tablas e índices de rendimiento',
      'UX funcional adaptada a cada perfil de usuario: operativo, productivo y analítico',
      'Pensamiento de producto end-to-end: desde el flujo de cocina hasta los reportes del dueño',
      'Sistema preparado para crecer a múltiples sucursales'
    ],
    features: [
      ['Login unificado', 'Pantalla de acceso con selector de perfil (Admin, Garzón, Cocina). Autentica por PIN o contraseña y redirige al panel correspondiente según el rol de sesión.', 'index.php'],
      ['Panel Garzón', 'Mapa visual del salón con 20 mesas y estados en tiempo real. Permite abrir mesa, tomar pedido con detalle por producto, cantidad y nota, ver timer de mesa, marcar platos como sirviendo y liberar la mesa al finalizar.', 'garzon/index.php'],
      ['Panel Cocina', 'Tarjetas de comandas con actualización automática. Muestra estado (en espera / preparando), timer por tarjeta con alerta en ámbar a los 8 minutos y rojo a los 15, badge de nuevas órdenes con sonido, e historial del turno.', 'cocina/index.php'],
      ['Dashboard Admin — KPIs en tiempo real', 'Vista operativa con auto-actualización cada 8 segundos. Muestra pedidos del día, platos despachados, tiempo promedio de preparación, mesas activas, garzón más activo, alertas de stock bajo, pedidos de la semana y del mes, y gráfico de pedidos por hora.', 'admin/index.php'],
      ['Mapa del salón — Admin', 'Vista de administrador del salón con estado de cada mesa: libre, ocupada, preparando, lista y sirviendo. Incluye resumen de ocupación y pedidos activos en cocina.', 'admin/index.php'],
      ['Monitor de Cocina — Admin', 'Tabla en tiempo real con el estado de todos los pedidos activos: mesa, ítems, hora de entrada y estado actual.', 'admin/index.php'],
      ['Reportes', 'Análisis filtrable por rango de fechas. Incluye pedidos por día, horas pico, top productos de la semana y rendimiento por garzón con tiempo promedio.', 'admin/index.php'],
      ['Historial', 'Registro completo de pedidos completados con mesa, garzón, ítems, apertura, cierre, tiempo de preparación y método de pago. Exportable a CSV.', 'admin/index.php'],
      ['Gestión de Menú — Categorías y Productos', 'Alta, edición y eliminación de categorías con orden personalizable. Alta, baja y disponibilidad de productos con filtros por estado (disponible / agotado).', 'admin/index.php'],
      ['Control de Stock', 'Inventario de insumos con cantidad actual, mínimo, costo unitario y alertas de stock bajo. Alta, edición y eliminación de insumos por categoría y unidad.', 'admin/index.php'],
      ['Gestión de Personal', 'Alta y baja de colaboradores con nombre, rol, teléfono y email. Registro de mesas atendidas por día y mes.', 'admin/index.php'],
      ['Configuración del sistema', 'Nombre del restaurante, número de mesas, moneda, IVA, horario de apertura y cierre. URL del logo que se propaga automáticamente a los tres paneles.', 'admin/index.php']
    ],
    timeline: [
      ['Análisis del flujo operativo', 'Se estudió el flujo real de un restaurante: qué necesita ver el garzón en sala, qué recibe la cocina y qué datos requiere el administrador para gestionar el negocio.'],
      ['Modelado de base de datos', 'Se diseñó el esquema relacional con tablas para mesas, pedidos, detalle de pedidos, historial, productos, categorías, stock y personal. Se agregaron índices de rendimiento sobre campos de búsqueda frecuente.'],
      ['Backend y API REST', 'Se construyeron más de 35 endpoints en PHP organizados por dominio: mesas, pedidos, cocina, menú, categorías, stock, personal, KPIs, reportes e historial.'],
      ['Sistema de autenticación por roles', 'Login unificado con PHP sessions que redirige a cada usuario a su panel según el rol: admin, cajero, garzón o cocina. Protección de rutas con auth_guard.php.'],
      ['Desarrollo de paneles por rol', 'Cada panel fue diseñado para su usuario específico con la UX adecuada: mapa de mesas para el garzón, tarjetas con timers para cocina, y dashboard analítico para el administrador.'],
      ['Diseño del sistema visual', 'Paleta oceánica unificada en los tres paneles con tokens CSS (variables), tipografía Inter para la interfaz y diseño responsive en los tres paneles.']
    ],
    tech: [
      ['PHP', 'backend completo, autenticación por sesión y lógica de negocio'],
      ['MySQL', 'base de datos relacional con 7 tablas e índices de rendimiento'],
      ['REST API', 'más de 35 endpoints organizados por dominio'],
      ['HTML5', 'estructura de los tres paneles'],
      ['CSS custom properties', 'sistema de tokens con paleta oceánica unificada'],
      ['JavaScript', 'interacción, polling de datos y renderizado dinámico de UI'],
      ['Inter', 'tipografía de interfaz'],
      ['JetBrains Mono', 'tipografía para datos numéricos y KPIs']
    ],
    futuro: [
      ['printer-fill', 'Impresión de ticket térmica', 'Integración con impresoras térmicas para emitir ticket automático al cobrar una mesa.'],
      ['bell-fill', 'Notificaciones push', 'Alertas en tiempo real cuando llega una comanda nueva, sin necesidad de mantener la ventana activa.'],
      ['bar-chart-fill', 'Dashboard con gráficos visuales', 'Reportes con charts interactivos de ventas por día, hora pico y productos más pedidos.'],
      ['phone-fill', 'PWA para cocina', 'Versión instalable en tablet o smartphone para que cocina no dependa de un computador fijo.'],
      ['buildings', 'Multi-sucursal', 'Soporte para gestionar múltiples locales desde un mismo panel administrativo con datos separados por sucursal.'],
      ['credit-card-fill', 'Integración de pagos', 'Flujo de cobro con splits de cuenta, propina y registro automático de método de pago en el historial.']
    ]
  },

  {
    slug: 'todopsn-chile',
    titulo: 'TodoPSN Chile',
    grupo: 'propio',
    destacado: 3,
    kicker: 'Ecommerce · Streaming',
    desc: 'Tienda online de cuentas y suscripciones de streaming y música, con catálogo de 14 plataformas, sistema de promociones y flujo de compra que termina en confirmación por WhatsApp.',
    descCorta: 'Tienda de suscripciones de streaming en uso real, con checkout que termina en WhatsApp.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'PHP', 'MySQL'],
    anio: '2025',
    estado: 'En uso',
    portada: 'uploads/2026/06/portada-todopsnchile.png',
    galeria: [
      'uploads/2026/07/ChatGPT-Image-14-jul-2026-13_54_21.png',
      'uploads/2026/07/49d66df2-5f70-4b5b-8990-7df3ce410009.png',
      'uploads/2026/06/todopsnchile-2.png'
    ],
    stats: [
      ['14', 'plataformas de streaming y música'],
      ['2', 'archivos JSON para catálogo y promociones'],
      ['5', 'pasos en el flujo de compra']
    ],
    problema: 'Vender cuentas y suscripciones compartidas de streaming requiere mostrar muchas plataformas distintas, cada una con varios planes y precios, además de coordinar manualmente el pago y la entrega con cada cliente por separado.',
    solucion: 'Un catálogo dinámico con 14 plataformas (Netflix, Spotify, Disney+, MAX, Prime Video, YouTube Premium, Apple TV+, Paramount+, Vix, Roku, Crunchyroll, Zapping, Movistar TV y Viki), cargado desde archivos JSON para poder actualizar precios sin tocar el código. El cliente elige plataforma y plan, ingresa sus datos, ve el resumen de compra y los datos de transferencia, y al confirmar se genera automáticamente un mensaje de WhatsApp con todo el detalle listo para enviar.',
    resultado: [
      'En uso activo para la venta real de cuentas de streaming',
      'Catálogo de 14 plataformas más sistema de promociones con combos',
      'Flujo de compra de principio a fin sin intervención manual hasta el paso de WhatsApp',
      'Sistema de comentarios con backend propio en PHP y MySQL'
    ],
    demuestra: [
      'Integración de un flujo de compra completo de varios pasos en un modal',
      'Consumo de datos dinámicos desde JSON para mantener el catálogo editable',
      'Backend en PHP con MySQL para comentarios persistentes',
      'Uso de Tailwind CSS para una interfaz responsiva'
    ],
    features: [
      ['Catálogo de plataformas', 'Grilla de 14 servicios de streaming y música, cada uno con sus planes y precios cargados desde planes.json.', 'index.html'],
      ['Sistema de promociones', 'Combos de varias plataformas agrupadas como packs con precio especial, cargados desde promos.json.', 'index.html'],
      ['Flujo de compra', 'Modal de varios pasos: selección de plan, datos del cliente, resumen, datos de transferencia y confirmación por WhatsApp.', 'index.html'],
      ['Comentarios de clientes', 'Guarda y muestra comentarios reales usando una base de datos MySQL, a través de un backend en PHP.', 'php/save_comment.php'],
      ['Contador de visitas', 'Registra cada visita en la base de datos y cuenta el total de visitas únicas por IP.', 'php/visit.php']
    ],
    timeline: [
      ['Estructura del catálogo', 'Se definieron las plataformas y sus planes en archivos JSON separados, para poder actualizar precios y agregar servicios sin modificar el HTML o JavaScript.'],
      ['Flujo de compra paso a paso', 'Se diseñó el modal de compra como una secuencia de pantallas: selección de plan, datos del cliente, resumen y confirmación, terminando en un mensaje pre-armado hacia WhatsApp.'],
      ['Backend con PHP y MySQL', 'Se implementó conexión a base de datos para los comentarios de clientes y el conteo de visitas, usando sentencias preparadas para evitar inyección SQL en el guardado de comentarios.']
    ],
    tech: [
      ['HTML5', 'estructura de la página'],
      ['Tailwind CSS', 'estilos y diseño responsivo'],
      ['JavaScript', 'flujo de compra y carga dinámica de datos'],
      ['PHP', 'backend para comentarios y conteo de visitas'],
      ['MySQL', 'base de datos de comentarios y visitas'],
      ['JSON', 'catálogo de plataformas y promociones']
    ],
    futuro: [
      ['eye-fill', 'Mostrar el conteo real de visitas', 'Actualmente la página muestra un número simulado en vez del conteo real que ya existe en la base de datos.'],
      ['gear-fill', 'Panel de administración', 'Editor visual para actualizar plataformas, planes y precios sin tocar los archivos JSON directamente.'],
      ['credit-card-fill', 'Pago integrado', 'Reemplazar la confirmación manual por WhatsApp con una pasarela de pago real.'],
      ['chat-square-quote-fill', 'Reemplazar testimonios de ejemplo', 'Mostrar comentarios reales de clientes desde la base de datos en vez del listado fijo actual.']
    ]
  },

  {
    slug: 'auditoria-de-accesibilidad-web',
    titulo: 'Auditoría de accesibilidad web',
    grupo: 'universidad',
    kicker: 'Auditoría UX · Accesibilidad Web',
    desc: 'Auditoría de accesibilidad realizada sobre el sitio web de Nike, evaluando su cumplimiento con las pautas WCAG y detectando problemas de usabilidad, navegación e interacción. El proyecto transforma un informe técnico en una presentación editorial con una identidad visual inspirada en la marca.',
    tags: ['Figma', 'WCAG 2.1', 'UX Research'],
    anio: '2025',
    estado: 'Completado',
    portada: 'uploads/2026/07/ce0954e4-6659-4d73-aed0-6896bca7d120-1024x683.png',
    galeria: [
      'uploads/2026/07/ChatGPT-Image-15-jul-2026-08_32_03-a.m.-1.png',
      'uploads/2026/07/ce0954e4-6659-4d73-aed0-6896bca7d120.png',
      'uploads/2026/07/auditorianike-1-scaled.png'
    ],
    stats: [
      ['4', 'principios WCAG evaluados'],
      ['20+', 'observaciones documentadas'],
      ['1', 'propuesta completa de mejora visual'],
      ['100%', 'del informe con identidad editorial propia']
    ],
    problema: 'El sitio web de Nike presentaba distintos problemas de accesibilidad que podían dificultar la navegación para usuarios con diferentes capacidades. La auditoría buscó identificar estas barreras, evaluar el cumplimiento de las recomendaciones WCAG y proponer mejoras que permitieran ofrecer una experiencia más inclusiva.',
    solucion: 'Se realizó una auditoría completa del sitio analizando criterios de accesibilidad, estructura visual, navegación, contraste, jerarquía de contenidos y operabilidad. Los hallazgos fueron organizados en un informe visual con un diseño inspirado en la identidad de Nike, facilitando la comprensión de los problemas detectados y de las soluciones propuestas.',
    resultado: [
      'Cada problema fue documentado con evidencia visual.',
      'Se identificaron oportunidades concretas de mejora basadas en WCAG.',
      'Se desarrolló una presentación con estética editorial y branding inspirado en Nike.',
      'El informe permitió comunicar información técnica de forma clara y atractiva.'
    ],
    demuestra: [
      'Diseño editorial aplicado a proyectos digitales.',
      'Capacidad para realizar auditorías UX y de accesibilidad.',
      'Análisis crítico de interfaces web.',
      'Presentación profesional de documentación técnica.',
      'Aplicación de principios de UX/UI.'
    ],
    features: [
      ['Investigación inicial', 'Análisis del sitio web de Nike y definición de los criterios de evaluación basados en accesibilidad.'],
      ['Auditoría de accesibilidad', 'Evaluación del sitio utilizando las pautas WCAG para detectar problemas de navegación, percepción, comprensión y robustez.'],
      ['Registro de evidencias', 'Capturas del sitio acompañadas de anotaciones para documentar cada problema encontrado.'],
      ['Propuesta de mejoras', 'Planteamiento de soluciones orientadas a mejorar la experiencia de usuarios con diferentes necesidades.'],
      ['Diseño editorial', 'Creación de una presentación visual inspirada en el branding de Nike, transformando un informe técnico en una pieza de comunicación visual.']
    ],
    timeline: [
      ['Investigación', 'Análisis del sitio y estudio de las pautas WCAG aplicables.'],
      ['Evaluación', 'Inspección detallada de las distintas páginas y componentes del sitio.'],
      ['Documentación', 'Registro de problemas mediante capturas y explicaciones técnicas.'],
      ['Rediseño conceptual', 'Propuesta de mejoras para resolver los problemas encontrados.'],
      ['Diseño final', 'Maquetación de la auditoría utilizando una identidad visual coherente con la marca Nike.']
    ],
    tech: [
      ['Figma', 'composición, diagramación y diseño editorial'],
      ['WCAG 2.1', 'criterios de accesibilidad de la auditoría'],
      ['UX Research', 'análisis de experiencia de usuario'],
      ['Diseño Editorial', 'organización visual de la información']
    ],
    futuro: []
  },

  {
    slug: 'drake-experience',
    titulo: 'Drake Experience',
    grupo: 'universidad',
    kicker: 'WordPress · WooCommerce',
    desc: 'Sitio tipo fan page de Drake, desarrollado en WordPress con WooCommerce para la tienda de merchandising, como examen integrador de Lenguaje de Programación y Administración de Contenidos.',
    tags: ['WordPress', 'WooCommerce', 'PHP', 'MySQL', 'JavaScript', 'jQuery', 'Bootstrap'],
    anio: '2025',
    estado: 'Archivado',
    portada: 'uploads/2026/06/portada-drake.png',
    galeria: [
      'uploads/2026/06/drake1-1.png',
      'uploads/2026/06/drake1-2.png',
      'uploads/2026/06/drake1-3.png'
    ],
    stats: [
      ['2', 'ramos integrados en un solo examen'],
      ['6', 'secciones principales del sitio'],
      ['1', 'tienda funcional con WooCommerce']
    ],
    problema: 'El examen integraba dos ramos — Lenguaje de Programación y Administración de Contenidos — y pedía construir un sitio completo usando WordPress como CMS, con WooCommerce para una tienda funcional, personalización de plantillas y JavaScript para conectar la interfaz con el sitio.',
    solucion: 'Un sitio de varias secciones sobre Drake (inicio, biografía, discografía, eventos, blog y tienda) construido sobre WordPress, con WooCommerce gestionando el catálogo y flujo de compra de la tienda de merchandising. Las plantillas se personalizaron a nivel visual para alejarse del diseño por defecto, y JavaScript se usó para conectar la interfaz con el contenido de WordPress y WooCommerce: peticiones fetch, carga dinámica de contenido y comportamiento interactivo en cada sección.',
    resultado: [
      'Sitio funcional con tienda integrada en WooCommerce',
      'Plantillas de WordPress personalizadas a nivel visual',
      'Base de datos en MySQL gestionada a través de WordPress',
      'Examen aprobado para ambos ramos'
    ],
    demuestra: [
      'Instalación, configuración y personalización de un sitio en WordPress',
      'Integración de WooCommerce, incluyendo catálogo y pasarela de pago',
      'Uso de JavaScript para conectar la interfaz con el CMS (fetch, llamados, render dinámico)',
      'Manejo de bases de datos MySQL en el contexto de un CMS',
      'Trabajo con plugins dentro del ecosistema de WordPress'
    ],
    features: [
      ['Inicio', 'Presentación tipo "reproductor" con canción destacada e imagen de fondo difuminada.'],
      ['Acerca de', 'Biografía con hitos por época, maquetada como plantilla personalizada de WordPress.'],
      ['Discografía', 'Sección con carruseles de canciones y álbumes, y playlists con tracklist desplegable.'],
      ['Eventos', 'Catálogo de tipos de entrada a conciertos, cada uno con su página de detalle.'],
      ['Blog', 'Noticias organizadas por categoría: lanzamientos, polémicas y moda.'],
      ['Tienda', 'Catálogo de merchandising gestionado con WooCommerce, incluyendo carrito y proceso de pago.']
    ],
    timeline: [
      ['Diseño de las secciones', 'Se planificó el sitio en base a las distintas facetas del artista: biografía, discografía, eventos, blog y tienda, cada una como su propia plantilla.'],
      ['Instalación y configuración de WordPress', 'Se instaló WordPress junto con WooCommerce, configurando la tienda, productos y proceso de compra para la sección de merchandising.'],
      ['Personalización de plantillas', 'Se intervinieron las plantillas por defecto de WordPress y WooCommerce para lograr un diseño propio, alejado de la apariencia estándar del CMS.'],
      ['Integración con JavaScript', 'Se conectó la interfaz con el contenido de WordPress usando JavaScript: peticiones fetch, llamados dinámicos y renderizado de contenido en cada sección.']
    ],
    tech: [
      ['WordPress', 'CMS base del sitio'],
      ['WooCommerce', 'tienda y proceso de compra'],
      ['PHP', 'lógica del lado del servidor vía WordPress'],
      ['MySQL', 'base de datos del CMS'],
      ['JavaScript', 'fetch y comportamiento dinámico de la interfaz'],
      ['jQuery', 'manipulación del DOM e interacciones'],
      ['Bootstrap', 'maquetado y estilos base']
    ],
    futuro: [
      ['cloud-arrow-up-fill', 'Recuperar el respaldo del sitio', 'El código fuente de la instalación en WordPress se perdió; queda pendiente reconstruirlo o migrarlo a un respaldo más seguro.']
    ]
  },

  /* ── LABORATORIO CREATIVO ─────────────────────────────── */

  {
    slug: 'ale-ink',
    titulo: 'Ale.ink Estudio de tatuajes',
    grupo: 'experimento',
    destacado: 2,
    kicker: 'Sitio web · Estudio de tatuajes',
    desc: 'Sitio web de dos vistas para ALE.INK, un estudio de tatuajes en Viña del Mar. Incluye landing pública con portafolio, cotizador en 5 pasos y Flash Shop, más un panel de artista con gestión de cotizaciones, agenda y estadísticas.',
    descCorta: 'Landing, cotizador en 5 pasos y panel privado para un estudio de tatuajes en Viña del Mar.',
    tags: ['HTML', 'CSS', 'JavaScript', 'localStorage'],
    anio: '2026',
    estado: 'Completado',
    portada: 'uploads/2026/06/ale.ink_.jpg',
    fondo: 'uploads/2026/06/ale.ink_.jpg',
    galeria: [
      'uploads/2026/07/bad6f209-ecb8-4f01-8a39-d47ddf60b1fc.png',
      'uploads/2026/07/ad3c046a-e589-46a1-a8b3-0195fe2b6b81.png',
      'uploads/2026/07/14403bc5-7722-4bb1-a958-38ecfbe32819.png',
      'uploads/2026/07/Gemini_Generated_Image_xxuacvxxuacvxxua.png'
    ],
    stats: [
      ['2', 'vistas completas en un único archivo HTML'],
      ['12', 'diseños flash organizados en 6 estilos'],
      ['5', 'pasos en el cotizador'],
      ['4', 'módulos en el panel de artista'],
      ['6', 'estilos de tatuaje con filtros interactivos'],
      ['0', 'dependencias externas de JavaScript']
    ],
    problema: 'El cliente necesitaba una presencia digital que reflejara el nivel premium de su trabajo como tatuador, con una forma real de recibir cotizaciones sin depender de DMs en Instagram ni llamadas telefónicas.',
    solucion: 'Se desarrolló un sitio de una sola página HTML con dos vistas: una landing pública con portafolio por estilos, Flash Shop interactivo y un cotizador en 5 pasos, y un panel de artista privado con PIN de acceso para gestionar cotizaciones entrantes, agenda semanal y estadísticas del estudio. La comunicación entre vistas se resuelve con localStorage como puente de datos.',
    resultado: [
      'Landing pública completa con hero, portafolio, servicios, flash shop, testimonios, precios y cotizador',
      'Panel de artista con 4 módulos: cotizaciones, agenda, estadísticas y configuración',
      'Sistema de cotización en 5 pasos con estimación instantánea y resumen antes de enviar',
      'Arquitectura sin backend: todo corre en el navegador con localStorage como base de datos (etapa de prototipo)'
    ],
    demuestra: [
      'Diseño orientado a la identidad de marca',
      'Desarrollo de interfaces complejas en vanilla JS sin frameworks',
      'Arquitectura de datos client-side con localStorage como puente entre vistas',
      'UX/UI con cursor personalizado, animaciones reveal y mosaico responsive',
      'Capacidad de construir un producto completo end-to-end para un cliente real'
    ],
    features: [
      ['Landing pública', 'Hero con video de fondo, estadísticas animadas, call-to-action y navegación sticky.'],
      ['Portafolio por estilos', 'Mosaico CSS filtrable con 8 piezas organizadas en 6 categorías: Blackwork, Realismo, Fine Line, Geométrico, Traditional, Acuarela.'],
      ['Flash Shop', 'Mini e-commerce por estilos con 12 diseños, estados disponible/vendido, precio y sistema de reserva integrado al cotizador.'],
      ['Cotizador (5 pasos)', 'Flujo guiado: selección de estilo → medidas y zona del cuerpo → descripción del concepto → referencias visuales → datos de contacto. Genera resumen instantáneo.'],
      ['Panel de artista', 'Vista privada con acceso por PIN. Módulos de cotizaciones entrantes (con filtros y exportación CSV), agenda semanal, estadísticas del estudio y configuración.']
    ],
    timeline: [
      ['Definición de arquitectura', 'Se planteó un sistema de dos vistas dentro de un único archivo HTML, usando localStorage como puente de datos entre la vista pública y el panel de artista. Sin backend ni framework.'],
      ['Diseño del sistema visual', 'Se construyó un sistema de tokens CSS (variables) basado en la identidad del cliente: fondo #080808, acento rojo #ff003c, tipografía mixta display/cuerpo/mono. Cursor personalizado, animaciones con IntersectionObserver.'],
      ['Desarrollo de módulos', 'Se implementaron los módulos de forma iterativa: primero la landing (hero, about, galería, servicios), luego el Flash Shop con tabs por estilo, después el wizard de cotización en 5 pasos, y finalmente el panel de artista.'],
      ['Iteración de contraste y UX', 'Se realizaron múltiples revisiones de contraste para cumplir AA, correcciones de legibilidad en labels, fixes de navegación mobile y limpieza de datos de prueba.']
    ],
    tech: [
      ['HTML5', 'estructura semántica de ambas vistas en un único archivo'],
      ['CSS custom properties', 'sistema de tokens para colores, tipografía y espaciado'],
      ['JavaScript vanilla', 'toda la lógica de UI, cotizador, flash shop y admin panel'],
      ['localStorage', 'base de datos client-side para cotizaciones entre vistas']
    ],
    futuro: [
      ['cloud-arrow-up-fill', 'Backend real con Firebase o Supabase', 'Reemplazar localStorage por una base de datos en la nube para sincronizar cotizaciones entre dispositivos y acceder al panel desde cualquier lugar.'],
      ['whatsapp', 'Notificaciones WhatsApp automáticas', 'Integrar la API de WhatsApp Business para enviar confirmación al cliente y alerta al artista cuando llega una cotización nueva.'],
      ['shield-lock-fill', 'Autenticación segura del panel', 'Reemplazar el PIN simple por un sistema de login con JWT para proteger el panel de artista de manera real.'],
      ['images', 'Galería dinámica desde CMS', 'Conectar el portafolio a un CMS headless o panel propio para que el artista pueda agregar piezas sin tocar código.']
    ]
  },

  {
    slug: 'fascia',
    titulo: 'Proyecto Fascia',
    grupo: 'experimento',
    kicker: 'Sistema web · Gestión deportiva',
    desc: 'Sistema de gestión para entrenadores: plantel de atletas, constructor de rutinas con modelo de cuerpo interactivo, sesiones en vivo, rendimiento, calendario, nutrición, pagos y documentos. Es la evolución de GymPrime hacia un sistema completo.',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'localStorage'],
    anio: '2026',
    estado: 'En desarrollo',
    portada: 'uploads/2026/07/portada-1024x683.png',
    fondo: 'uploads/2026/07/portada.png',
    galeria: [
      'uploads/2026/07/a211faf33ee18a45dc103d99687b2bea_0.png',
      'uploads/2026/07/portada.png',
      'uploads/2026/07/741670184_1346529904278142_5608520243856905468_n.jpg',
      'uploads/2026/07/742648840_994260030268062_9161383721408349158_n.jpg',
      'uploads/2026/07/742185726_2017860485513272_5079963401177222864_n.jpg',
      'uploads/2026/07/744314930_1324933139619625_5071325203197227118_n.jpg',
      'uploads/2026/07/740686125_1614920560634454_8432972194180963196_n.jpg'
    ],
    stats: [
      ['9', 'módulos funcionales'],
      ['2', 'vistas del modelo de cuerpo (frontal y posterior)'],
      ['1', 'cronómetro en tiempo real para sesiones en vivo']
    ],
    problema: 'GymPrime resolvía lo básico de un gimnasio (planes, alumnos, cupos), pero un entrenador real necesita mucho más: armar rutinas personalizadas por grupo muscular, hacer seguimiento de sesiones en tiempo real, registrar rendimiento, manejar pagos y documentos de cada atleta.',
    solucion: 'Un sistema con 9 módulos: Dashboard general, Plantel de atletas, Constructor de rutinas con un modelo de cuerpo humano interactivo (se toca cada músculo para asignarle ejercicios, día por día), Sesión en vivo con cronómetro para registrar series mientras se entrena, Rendimiento, Calendario, Nutrición, Pagos y Documentos. Por ahora corre completo en el navegador con localStorage, como continuación directa de GymPrime, con la meta de convertirlo en una app web o nativa real.',
    resultado: [
      '9 módulos funcionales construidos sobre la base de GymPrime',
      'Constructor de rutinas visual mediante modelo de cuerpo interactivo',
      'Modo de sesión en vivo con cronómetro y registro en tiempo real',
      'Aún en desarrollo, con prototipo activo en GitHub Pages'
    ],
    demuestra: [
      'Integración de una librería externa (React + react-muscle-highlighter) sin proceso de build',
      'Diseño de un sistema multi-módulo con estado centralizado',
      'Construcción de una interfaz interactiva basada en un modelo anatómico',
      'Evolución iterativa de un proyecto propio (GymPrime → Fascia)'
    ],
    features: [
      ['Dashboard', 'Resumen general con estadísticas, deportes activos, agenda y plantel.', 'index.html'],
      ['Plantel de atletas', 'Listado de atletas en vista grilla o lista, con búsqueda y filtro por deporte y estado.', 'index.html'],
      ['Constructor de rutinas', 'Modelo de cuerpo interactivo (frontal y posterior): se activa un día de la semana y se toca cada músculo para asignarle ejercicios.', 'index.html'],
      ['Sesión en vivo', 'Modo de entrenamiento en tiempo real con cronómetro, usando el mismo modelo de cuerpo para registrar series completadas.', 'index.html'],
      ['Rendimiento', 'Registro y seguimiento de métricas de cada atleta.', 'index.html'],
      ['Calendario, nutrición, pagos y documentos', 'Módulos de gestión general para cada atleta: eventos, planes alimenticios, cobros y documentos asociados.', 'index.html']
    ],
    timeline: [
      ['Punto de partida: GymPrime', 'Se tomó como base la lógica de gestión de alumnos y planes ya validada en GymPrime, para no partir de cero.'],
      ['Diseño de los módulos', 'Se definieron los 9 módulos necesarios para cubrir el trabajo real de un entrenador: plantel, rutinas, sesiones, rendimiento, calendario, nutrición, pagos y documentos.'],
      ['Constructor de rutinas con modelo de cuerpo', 'Se integró la librería react-muscle-highlighter sobre React 18, cargada directamente desde CDN sin proceso de build, para representar el cuerpo humano de forma clickeable.'],
      ['Modo sesión en vivo', 'Se reutilizó el mismo modelo de cuerpo del constructor, pero conectado a un cronómetro y al registro de series completadas en tiempo real durante el entrenamiento.']
    ],
    tech: [
      ['HTML5', 'estructura de la aplicación'],
      ['CSS3', 'estilos e interfaz'],
      ['JavaScript', 'toda la lógica del sistema'],
      ['React 18', 'motor del modelo de cuerpo interactivo'],
      ['react-muscle-highlighter', 'librería del modelo anatómico clickeable'],
      ['localStorage', 'persistencia de datos en el navegador']
    ],
    futuro: [
      ['server', 'Backend real con base de datos', 'Migrar de localStorage a un servidor con base de datos, para que los datos no dependan de un solo navegador.'],
      ['phone-fill', 'App web o nativa', 'Convertir el sistema en una aplicación instalable, ya sea web (PWA) o nativa para celular.'],
      ['rocket-takeoff-fill', 'Publicación para uso real', 'Llevar el sistema a un estado estable para que un entrenador lo use en el día a día, como ya ocurre con GymPrime.'],
      ['people-fill', 'Multi-usuario y roles', 'Permitir que distintos entrenadores gestionen sus propios atletas dentro del mismo sistema.']
    ]
  },

  {
    slug: 'gym-prime',
    titulo: 'GymPrime',
    grupo: 'experimento',
    kicker: 'Sistema web · Gimnasio',
    desc: 'Landing y panel de administración para un gimnasio, con gestión de planes, alumnos y registro de ejercicios. Construido en HTML, CSS y JavaScript puro, usando localStorage como base de datos.',
    tags: ['HTML', 'CSS', 'JavaScript', 'localStorage'],
    anio: '2025',
    estado: 'En uso',
    portada: 'uploads/2026/06/portada-gymprime.png',
    fondo: 'uploads/2026/06/gymprime1.png',
    galeria: [
      'uploads/2026/06/gymprime1.png',
      'uploads/2026/06/gymprime-screenshot-3.png',
      'uploads/2026/06/gymprime-screenshot-1.png',
      'uploads/2026/06/gymprime-screenshot-2.png'
    ],
    stats: [
      ['3', 'planes disponibles (Mensual, 3 Meses, Anual)'],
      ['2', 'paneles independientes: landing y dashboard'],
      ['100%', 'en uso activo por el entrenador']
    ],
    problema: 'Un gimnasio necesitaba una forma simple de llevar el control de sus planes, alumnos inscritos y cupos disponibles, sin depender de planillas sueltas o anotaciones manuales.',
    solucion: 'Un sitio con landing pública y un panel de administración aparte: la landing muestra los planes disponibles y permite inscribir alumnos directamente, mientras que el dashboard centraliza la gestión completa — planes, alumnos y un sistema de ejercicios con registro de peso por alumno. Los datos se guardan en el navegador con localStorage, sin necesidad de un servidor o base de datos externa.',
    resultado: [
      'En uso activo por el entrenador del gimnasio desde su implementación',
      'Reemplazo de planillas y anotaciones manuales por un sistema centralizado',
      'Visibilidad inmediata de cupos disponibles por plan',
      'Registro histórico de peso por alumno en cada ejercicio'
    ],
    demuestra: [
      'Manejo de localStorage como base de datos del lado del cliente',
      'Cálculo dinámico de cupos restantes por plan',
      'Construcción de modales y formularios propios sin librerías externas',
      'Organización de una landing pública separada de un panel administrativo'
    ],
    features: [
      ['Landing pública', 'Muestra métricas generales y la lista de planes disponibles, con la opción de inscribir un alumno directamente desde ahí.', 'index.html'],
      ['Gestión de planes', 'Crear, editar y eliminar planes del gimnasio, cada uno con precio, cupos totales y descripción.', 'dashboard.html'],
      ['Gestión de alumnos', 'Listado de alumnos inscritos con ver detalle, editar datos (fecha de ingreso, fecha de pago, estado) y eliminar.', 'dashboard.html'],
      ['Registro de ejercicios', 'Creación de ejercicios y registro del peso levantado por cada alumno en cada uno, con historial editable.', 'dashboard.html']
    ],
    timeline: [
      ['Diseño de la landing pública', 'Se construyó la página principal con las métricas generales y el listado de planes, pensada para que cualquier visitante vea la oferta del gimnasio de forma clara.'],
      ['Sistema de planes y alumnos', 'Se implementó la lógica de inscripción: cada plan con cupos limitados, y el cálculo automático de cupos restantes según los alumnos ya inscritos.'],
      ['Panel de administración', 'Se separó la gestión en un dashboard aparte, con vistas dedicadas para planes, alumnos inscritos y sus datos de ingreso y pago.'],
      ['Sistema de ejercicios', 'Se agregó un módulo adicional para registrar ejercicios y llevar el historial de peso levantado por cada alumno, ampliando el sistema más allá de la gestión administrativa básica.']
    ],
    tech: [
      ['HTML5', 'estructura de landing y dashboard'],
      ['CSS3', 'estilos y diseño visual'],
      ['JavaScript', 'toda la lógica e interactividad'],
      ['localStorage', 'persistencia de datos en el navegador']
    ],
    futuro: [
      ['server', 'Backend real con base de datos', 'Migrar de localStorage a una base de datos en servidor, para que los datos no dependan de un solo navegador y se puedan respaldar.'],
      ['shield-lock-fill', 'Login con roles', 'Acceso diferenciado para el entrenador y posibles administradores adicionales.'],
      ['bell-fill', 'Notificaciones de vencimiento', 'Aviso automático cuando se acerca la fecha de pago o vencimiento del plan de un alumno.'],
      ['bar-chart-fill', 'Reportes y estadísticas', 'Gráficos de ingresos, alumnos activos por plan y evolución de peso por ejercicio.']
    ]
  }
];
