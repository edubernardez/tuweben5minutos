/* =========================================
   BASE DE DATOS & CONFIGURACIÓN (DEMO)
   ========================================= */

// Datos por defecto (se sobrescriben desde el Generador)
var INFO_NEGOCIO = {
    nombre: "Mi Tienda",
    slogan: "Calidad y precio.",
    whatsapp: "59899000000", 
    moneda: "$",
    anuncios: [
        "🔥 Envío GRATIS superando $2.000",
        "💳 3 Cuotas Sin Interés con Visa",
        "🚀 Recibilo HOY comprando antes de las 14hs"
    ]
};

/* --- BANNERS POR RUBRO (Imágenes optimizadas) --- */
const BANNERS = {
    'moda': "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1500&q=80",
    'tecnologia': "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1500&q=80",
    'comida': "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80",
    'servicios': "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1500&q=80",
    'deportes': "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1500&q=80",
    'hogar': "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=1500&q=80",
    'belleza': "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=1500&q=80",
    'default': "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1500&q=80"
};

/* --- CATÁLOGOS PREDEFINIDOS (Mejorados para que no fallen) --- */
const CATALOGOS = {
    'moda': [
        { id: 101, nombre: "Remera Oversize Black", precio: 1200, categoria: "destacado", imagen: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80", stock: true },
        { id: 102, nombre: "Hoodie Essential Grey", precio: 2800, categoria: "todos", imagen: "https://images.unsplash.com/photo-1556906781-9a412961d289?w=500&q=80", stock: true },
        { id: 103, nombre: "Zapatillas Urban", precio: 4500, categoria: "destacado", imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", stock: true },
        { id: 104, nombre: "Gorra Trucker", precio: 800, categoria: "todos", imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80", stock: true },
        { id: 105, nombre: "Jean Classic Blue", precio: 3200, categoria: "todos", imagen: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&q=80", stock: true },
        { id: 106, nombre: "Lentes de Sol", precio: 1500, categoria: "destacado", imagen: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80", stock: true }
    ],
    'tecnologia': [
        { id: 201, nombre: "Auriculares Bluetooth", precio: 3500, categoria: "destacado", imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", stock: true },
        { id: 202, nombre: "Smartwatch Sport", precio: 8900, categoria: "todos", imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", stock: true },
        { id: 203, nombre: "Teclado Mecánico", precio: 5600, categoria: "destacado", imagen: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500&q=80", stock: true },
        { id: 204, nombre: "Cámara Instant", precio: 12500, categoria: "todos", imagen: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80", stock: true }
    ],
    'comida': [
        { id: 301, nombre: "Hamburguesa Doble", precio: 650, categoria: "destacado", imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", stock: true },
        { id: 302, nombre: "Pizza Muzzarella", precio: 800, categoria: "todos", imagen: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80", stock: true },
        { id: 303, nombre: "Combo Sushi (15u)", precio: 950, categoria: "destacado", imagen: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80", stock: true },
        { id: 304, nombre: "Papas Fritas", precio: 400, categoria: "todos", imagen: "https://images.unsplash.com/photo-1573080496987-aeb7d53384a3?w=500&q=80", stock: true }
    ],
    'servicios': [
        { id: 401, nombre: "Consultoría 1h", precio: 2500, categoria: "destacado", imagen: "https://plus.unsplash.com/premium_photo-1661772661721-b16346fe5b0f?w=500&q=80", stock: true },
        { id: 402, nombre: "Soporte Técnico", precio: 1500, categoria: "todos", imagen: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80", stock: true },
        { id: 403, nombre: "Diseño Gráfico", precio: 5000, categoria: "todos", imagen: "https://images.unsplash.com/photo-1626785774573-4b7993143a2d?w=500&q=80", stock: true },
        { id: 404, nombre: "Mantenimiento Web", precio: 3000, categoria: "destacado", imagen: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&q=80", stock: true }
    ],
    'deportes': [
        { id: 501, nombre: "Pelota Fútbol Pro", precio: 1500, categoria: "destacado", imagen: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=500&q=80", stock: true },
        { id: 502, nombre: "Mancuernas 5kg", precio: 2200, categoria: "todos", imagen: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80", stock: true },
        { id: 503, nombre: "Mat de Yoga", precio: 900, categoria: "todos", imagen: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&q=80", stock: true },
        { id: 504, nombre: "Botella Deportiva", precio: 600, categoria: "todos", imagen: "https://images.unsplash.com/photo-1602143407151-0111419516eb?w=500&q=80", stock: true }
    ],
    'hogar': [
        { id: 601, nombre: "Lámpara Nórdica", precio: 4500, categoria: "destacado", imagen: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80", stock: true },
        { id: 602, nombre: "Planta de Interior", precio: 600, categoria: "todos", imagen: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80", stock: true },
        { id: 603, nombre: "Espejo Circular", precio: 3200, categoria: "todos", imagen: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&q=80", stock: true }
    ],
    'belleza': [
        { id: 701, nombre: "Serum Facial", precio: 1800, categoria: "destacado", imagen: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", stock: true },
        { id: 702, nombre: "Labial Matte", precio: 800, categoria: "todos", imagen: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80", stock: true },
        { id: 703, nombre: "Kit Brochas", precio: 1200, categoria: "todos", imagen: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=500&q=80", stock: true }
    ]
};

// INICIALIZACIÓN
var PRODUCTOS = CATALOGOS['moda'];