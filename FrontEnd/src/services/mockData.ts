// src/services/mockData.ts - EXPANDIDO CON MÁS DATOS
import {
    type ProductInterface,
    type CategoryInterface,
    type VendedorInterface,
} from "../types/types";

export const MOCK_CATEGORIES: CategoryInterface[] = [
    // ============ CATEGORÍAS PRINCIPALES ============
    { id: 1, name: "Electrónicos", img: "" },
    { id: 2, name: "Informática", img: "" },
    { id: 3, name: "Deportes", img: "" },
    { id: 4, name: "Ropa", img: "" },
    { id: 5, name: "Hogar", img: "" },
    { id: 6, name: "Automóvil", img: "" },
    { id: 7, name: "Libros y Entretenimiento", img: "" },
    { id: 8, name: "Salud y Belleza", img: "" },

    // ============ SUBCATEGORÍAS DE ELECTRÓNICOS (id: 1) ============
    { id: 10, name: "Smartphones", img: "", fatherId: 1 },
    { id: 11, name: "Tablets", img: "", fatherId: 1 },
    { id: 12, name: "Audio", img: "", fatherId: 1 },
    { id: 13, name: "Televisores", img: "", fatherId: 1 },
    { id: 14, name: "Cámaras", img: "", fatherId: 1 },
    { id: 15, name: "Videojuegos", img: "", fatherId: 1 },

    // ============ SUBCATEGORÍAS DE INFORMÁTICA (id: 2) ============
    { id: 20, name: "Portátiles", img: "", fatherId: 2 },
    { id: 21, name: "Componentes PC", img: "", fatherId: 2 },
    { id: 22, name: "Periféricos", img: "", fatherId: 2 },
    { id: 23, name: "Monitores", img: "", fatherId: 2 },
    { id: 24, name: "Almacenamiento", img: "", fatherId: 2 },

    // ============ SUBCATEGORÍAS DE DEPORTES (id: 3) ============
    { id: 30, name: "Fútbol", img: "", fatherId: 3 },
    { id: 31, name: "Running", img: "", fatherId: 3 },
    { id: 32, name: "Fitness", img: "", fatherId: 3 },
    { id: 33, name: "Ciclismo", img: "", fatherId: 3 },
    { id: 34, name: "Natación", img: "", fatherId: 3 },
    { id: 35, name: "Tenis", img: "", fatherId: 3 },

    // ============ SUBCATEGORÍAS DE ROPA (id: 4) ============
    { id: 40, name: "Hombre", img: "", fatherId: 4 },
    { id: 41, name: "Mujer", img: "", fatherId: 4 },
    { id: 42, name: "Niños", img: "", fatherId: 4 },
    { id: 43, name: "Bebés", img: "", fatherId: 4 },
    { id: 44, name: "Calzado", img: "", fatherId: 4 },
    { id: 45, name: "Accesorios", img: "", fatherId: 4 },

    // ============ SUBCATEGORÍAS DE HOGAR (id: 5) ============
    { id: 50, name: "Cocina", img: "", fatherId: 5 },
    { id: 51, name: "Decoración", img: "", fatherId: 5 },
    { id: 52, name: "Jardín", img: "", fatherId: 5 },
    { id: 53, name: "Electrodomésticos", img: "", fatherId: 5 },
    { id: 54, name: "Muebles", img: "", fatherId: 5 },
    { id: 55, name: "Textil Hogar", img: "", fatherId: 5 },

    // ============ SUBCATEGORÍAS DE AUTOMÓVIL (id: 6) ============
    { id: 60, name: "Repuestos", img: "", fatherId: 6 },
    { id: 61, name: "Accesorios", img: "", fatherId: 6 },
    { id: 62, name: "Neumáticos", img: "", fatherId: 6 },
    { id: 63, name: "Audio Coche", img: "", fatherId: 6 },
    { id: 64, name: "Herramientas", img: "", fatherId: 6 },

    // ============ SUBCATEGORÍAS DE LIBROS Y ENTRETENIMIENTO (id: 7) ============
    { id: 70, name: "Libros", img: "", fatherId: 7 },
    { id: 71, name: "Películas", img: "", fatherId: 7 },
    { id: 72, name: "Música", img: "", fatherId: 7 },
    { id: 73, name: "Juegos Mesa", img: "", fatherId: 7 },
    { id: 74, name: "Instrumentos", img: "", fatherId: 7 },

    // ============ SUBCATEGORÍAS DE SALUD Y BELLEZA (id: 8) ============
    { id: 80, name: "Cuidado Personal", img: "", fatherId: 8 },
    { id: 81, name: "Maquillaje", img: "", fatherId: 8 },
    { id: 82, name: "Perfumes", img: "", fatherId: 8 },
    { id: 83, name: "Suplementos", img: "", fatherId: 8 },
    { id: 84, name: "Cuidado Capilar", img: "", fatherId: 8 },
];

export const MOCK_PRODUCTS: ProductInterface[] = [
    // ============ PRODUCTOS MÁS VENDIDOS (primeros en el array) ============

    // 1. iPhone 13 Pro - Smartphones
    {
        id: 1,
        name: "iPhone 13 Pro",
        description:
            "Smartphone Apple con cámara profesional y chip A15 Bionic",
        img: [
            "https://www.powerplanetonline.com/cdnassets/apple_iphone_13_pro_grafito_01_l.jpg",
        ],
        video: [],
        price: 999,
        categories: [
            { id: 1, name: "Electrónicos", img: "" },
            { id: 10, name: "Smartphones", img: "", fatherId: 1 },
        ],
        vendedor: { id: 1, name: "TechStore Madrid", img: "" },
    },

    // 2. MacBook Air M2 - Portátiles
    {
        id: 2,
        name: "MacBook Air M2",
        description:
            "Portátil Apple con chip M2, pantalla Liquid Retina de 13.6 pulgadas",
        img: ["https://techcrunch.com/wp-content/uploads/2022/07/CMC_1580.jpg"],
        video: [],
        price: 1299,
        categories: [
            { id: 2, name: "Informática", img: "" },
            { id: 20, name: "Portátiles", img: "", fatherId: 2 },
        ],
        vendedor: { id: 1, name: "TechStore Madrid", img: "" },
    },

    // 3. Nike Air Max - Running
    {
        id: 3,
        name: "Nike Air Max 270",
        description:
            "Zapatillas deportivas con amortiguación Air Max para running",
        img: [
            "https://i1.t4s.cz//products/921522-034/nike-air-max-97-gs-715627-921522-034-960.webp",
        ],
        video: [],
        price: 129,
        categories: [
            { id: 3, name: "Deportes", img: "" },
            { id: 31, name: "Running", img: "", fatherId: 3 },
        ],
        vendedor: { id: 3, name: "SportZone", img: "" },
    },

    // 4. AirPods Pro - Audio
    {
        id: 4,
        name: "AirPods Pro 2ª Gen",
        description: "Auriculares inalámbricos con cancelación activa de ruido",
        img: [
            "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
        ],
        video: [],
        price: 279,
        categories: [
            { id: 1, name: "Electrónicos", img: "" },
            { id: 12, name: "Audio", img: "", fatherId: 1 },
        ],
        vendedor: { id: 1, name: "TechStore Madrid", img: "" },
    },

    // 5. Samsung Galaxy S22 - Smartphones
    {
        id: 5,
        name: "Samsung Galaxy S22",
        description: "Teléfono Android de última generación con cámara de 50MP",
        img: ["https://m.media-amazon.com/images/I/714LtBc8KzL.jpg"],
        video: [],
        price: 799,
        categories: [
            { id: 1, name: "Electrónicos", img: "" },
            { id: 10, name: "Smartphones", img: "", fatherId: 1 },
        ],
        vendedor: { id: 2, name: "PhoneShop Barcelona", img: "" },
    },

    // 6. Thermomix TM6 - Cocina
    {
        id: 6,
        name: "Robot de Cocina Thermomix TM6",
        description: "Robot multifunción para cocinar con conectividad WiFi",
        img: [
            "https://www.thermomix.es/uploads/images/_lightbox/TM6-Black-Edition-Front-sRGB.jpg",
        ],
        video: [],
        price: 1359,
        categories: [
            { id: 5, name: "Hogar", img: "" },
            { id: 50, name: "Cocina", img: "", fatherId: 5 },
        ],
        vendedor: { id: 5, name: "CocinaPlus", img: "" },
    },

    // ============ PRODUCTOS ADICIONALES ============

    // Más productos en Smartphones
    {
        id: 7,
        name: "Xiaomi Mi 13",
        description: "Smartphone Android con cámara Leica y carga rápida 67W",
        img: [
            "https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1678263384.69024170.png",
        ],
        video: [],
        price: 649,
        categories: [
            { id: 1, name: "Electrónicos", img: "" },
            { id: 10, name: "Smartphones", img: "", fatherId: 1 },
        ],
        vendedor: { id: 7, name: "XiaomiStore", img: "" },
    },

    {
        id: 8,
        name: "Google Pixel 7",
        description: "Smartphone con Google Tensor G2 y cámara computational",
        img: [
            "https://lh3.googleusercontent.com/yGNhsSanCKmCyrzNiE2-6KKxUJWdZmBjdqxOBGAzovF-yLr7GJqOyYO_3SZpjpOXhfKb=w300",
        ],
        video: [],
        price: 599,
        categories: [
            { id: 1, name: "Electrónicos", img: "" },
            { id: 10, name: "Smartphones", img: "", fatherId: 1 },
        ],
        vendedor: { id: 8, name: "GoogleStore", img: "" },
    },

    // Productos en Portátiles
    {
        id: 9,
        name: "Dell XPS 13",
        description:
            "Ultrabook premium con Intel Core i7 y pantalla InfinityEdge",
        img: [
            "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9315/media-gallery/notebook-xps-13-9315-nt-blue-gallery-1.psd",
        ],
        video: [],
        price: 1199,
        categories: [
            { id: 2, name: "Informática", img: "" },
            { id: 20, name: "Portátiles", img: "", fatherId: 2 },
        ],
        vendedor: { id: 4, name: "ComputerWorld", img: "" },
    },

    {
        id: 10,
        name: "Lenovo ThinkPad X1 Carbon",
        description: "Portátil profesional ultraligero con teclado premium",
        img: [
            "https://p4-ofp.static.pub/ShareResource/na/subseries/hero/lenovo-thinkpad-x1-carbon-gen-11-hero.png",
        ],
        video: [],
        price: 1599,
        categories: [
            { id: 2, name: "Informática", img: "" },
            { id: 20, name: "Portátiles", img: "", fatherId: 2 },
        ],
        vendedor: { id: 9, name: "LenovoPro", img: "" },
    },

    // Productos en Fitness
    {
        id: 11,
        name: "Cinta de Correr NordicTrack",
        description:
            "Cinta de correr plegable con pantalla táctil y programas iFit",
        img: [
            "https://www.nordictrack.es/dw/image/v2/BBSR_PRD/on/demandware.static/-/Sites-master-catalog/default/dw3e99c7e5/images/large/NETL87020.jpg",
        ],
        video: [],
        price: 899,
        categories: [
            { id: 3, name: "Deportes", img: "" },
            { id: 32, name: "Fitness", img: "", fatherId: 3 },
        ],
        vendedor: { id: 10, name: "FitnessCenter", img: "" },
    },

    {
        id: 12,
        name: "Pesas Ajustables Bowflex",
        description: "Set de pesas ajustables de 2.5kg a 24kg por mancuerna",
        img: [
            "https://www.bowflex.com/on/demandware.static/-/Sites-BowflexUS-Library/default/dw6c5e0e9f/selecttech/552i/BowFlex_SelectTech_552i_glamour_black_bg.jpg",
        ],
        video: [],
        price: 349,
        categories: [
            { id: 3, name: "Deportes", img: "" },
            { id: 32, name: "Fitness", img: "", fatherId: 3 },
        ],
        vendedor: { id: 10, name: "FitnessCenter", img: "" },
    },

    // Productos en Ropa Hombre
    {
        id: 13,
        name: "Camisa Casual Algodón",
        description: "Camisa de algodón 100% de manga larga, corte regular",
        img: [
            "https://static.zara.net/photos///2023/V/0/1/p/5575/300/250/2/w/850/5575300250_15_1_1.jpg",
        ],
        video: [],
        price: 29,
        categories: [
            { id: 4, name: "Ropa", img: "" },
            { id: 40, name: "Hombre", img: "", fatherId: 4 },
        ],
        vendedor: { id: 6, name: "ModaStyle", img: "" },
    },

    {
        id: 14,
        name: "Pantalón Chino Slim Fit",
        description: "Pantalón chino de algodón elástico, corte slim fit",
        img: [
            "https://static.zara.net/photos///2023/V/0/2/p/4391/300/712/2/w/850/4391300712_15_1_1.jpg",
        ],
        video: [],
        price: 35,
        categories: [
            { id: 4, name: "Ropa", img: "" },
            { id: 40, name: "Hombre", img: "", fatherId: 4 },
        ],
        vendedor: { id: 6, name: "ModaStyle", img: "" },
    },

    // Productos en Electrodomésticos
    {
        id: 15,
        name: "Aspiradora Robot Roomba",
        description: "Aspiradora robot con mapeo inteligente y conexión WiFi",
        img: [
            "https://www.irobot.es/dw/image/v2/BFXP_PRD/on/demandware.static/-/Sites-master-catalog-irobot/default/dw3e6c7845/images/large/R694020.jpg",
        ],
        video: [],
        price: 299,
        categories: [
            { id: 5, name: "Hogar", img: "" },
            { id: 53, name: "Electrodomésticos", img: "", fatherId: 5 },
        ],
        vendedor: { id: 11, name: "ElectroHogar", img: "" },
    },

    // Productos en Cámaras
    {
        id: 16,
        name: "Canon EOS R6 Mark II",
        description: "Cámara mirrorless full frame con grabación 4K",
        img: [
            "https://www.canon.es/media/canon-eos-r6-mark-ii_tcm73-1681844.jpg",
        ],
        video: [],
        price: 2499,
        categories: [
            { id: 1, name: "Electrónicos", img: "" },
            { id: 14, name: "Cámaras", img: "", fatherId: 1 },
        ],
        vendedor: { id: 12, name: "PhotoPro", img: "" },
    },

    // Productos en Videojuegos
    {
        id: 17,
        name: "PlayStation 5",
        description:
            "Consola de videojuegos de última generación con SSD ultrarrápido",
        img: [
            "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21",
        ],
        video: [],
        price: 499,
        categories: [
            { id: 1, name: "Electrónicos", img: "" },
            { id: 15, name: "Videojuegos", img: "", fatherId: 1 },
        ],
        vendedor: { id: 13, name: "GameZone", img: "" },
    },

    {
        id: 18,
        name: "Nintendo Switch OLED",
        description: "Consola portátil con pantalla OLED de 7 pulgadas",
        img: [
            "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000964/Nintendo_Switch_OLED_model_White_Set",
        ],
        video: [],
        price: 349,
        categories: [
            { id: 1, name: "Electrónicos", img: "" },
            { id: 15, name: "Videojuegos", img: "", fatherId: 1 },
        ],
        vendedor: { id: 13, name: "GameZone", img: "" },
    },

    // Productos en Ciclismo
    {
        id: 19,
        name: "Bicicleta Montaña Trek",
        description:
            "Bicicleta de montaña con suspensión delantera y 21 velocidades",
        img: [
            "https://trek.scene7.com/is/image/TrekBicycleProducts/1230000_2023_A_1_220_Mountain_Trek_Black",
        ],
        video: [],
        price: 599,
        categories: [
            { id: 3, name: "Deportes", img: "" },
            { id: 33, name: "Ciclismo", img: "", fatherId: 3 },
        ],
        vendedor: { id: 14, name: "BikeWorld", img: "" },
    },

    // Productos en Libros
    {
        id: 20,
        name: "El Quijote - Edición Ilustrada",
        description: "Edición de lujo ilustrada del clásico de Cervantes",
        img: [
            "https://www.casadellibro.com/libro-don-quijote-de-la-mancha-ilustrado-por-dore/muestraampliada/2900000916081",
        ],
        video: [],
        price: 45,
        categories: [
            { id: 7, name: "Libros y Entretenimiento", img: "" },
            { id: 70, name: "Libros", img: "", fatherId: 7 },
        ],
        vendedor: { id: 15, name: "LibreriaClasica", img: "" },
    },
];

export const MOCK_VENDORS: VendedorInterface[] = [
    { id: 1, name: "TechStore Madrid", img: "" },
    { id: 2, name: "PhoneShop Barcelona", img: "" },
    { id: 3, name: "SportZone", img: "" },
    { id: 4, name: "ComputerWorld", img: "" },
    { id: 5, name: "CocinaPlus", img: "" },
    { id: 6, name: "ModaStyle", img: "" },
    { id: 7, name: "XiaomiStore", img: "" },
    { id: 8, name: "GoogleStore", img: "" },
    { id: 9, name: "LenovoPro", img: "" },
    { id: 10, name: "FitnessCenter", img: "" },
    { id: 11, name: "ElectroHogar", img: "" },
    { id: 12, name: "PhotoPro", img: "" },
    { id: 13, name: "GameZone", img: "" },
    { id: 14, name: "BikeWorld", img: "" },
    { id: 15, name: "LibreriaClasica", img: "" },
];
