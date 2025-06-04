// src/services/mockData.ts - EXPANDIDO CON MÁS DATOS
import {
    type ProductInterface,
    type CategoryInterface,
    type VendedorInterface,
} from "../types/types";

export const MOCK_CATEGORIES:CategoryInterface[] = [
    // ============ CATEGORÍAS PRINCIPALES ============
    { id:1, name:"Ultramarinos", img:"" },
    { id:2, name:"Papelerías", img:"" },
    { id:3, name:"Discos y Coleccionismo", img:"" },
    { id:4, name:"Ropa", img:"" },
    { id:5, name:"Carpintería", img:"" },


    // ============ SUBCATEGORÍAS DE ULTRAMARINOS (id:1) ============

    { id:6, name:"Conservas ", img:"", fatherId:1 },
    { id:7, name:"Legumbres ", img:"", fatherId:1 },
    { id:8, name:"Embutidos ", img:"", fatherId:1 },
    { id:9, name:"Vinos y Licores", img:"", fatherId:1 },
    { id:10, name:"Aceites y Vinagres", img:"", fatherId:1 },
    { id:11, name:"Panadería y Repostería", img:"", fatherId:1 },

    // ============ SUBCATEGORÍAS DE PAPELERÍAS (id:2) ============

    { id:12, name:"Cartulinas y Papel", img:"", fatherId:2 },
    { id:13, name:"Útiles Escolares", img:"", fatherId:2 },
    { id:14, name:"Cuadernos y Libretas", img:"", fatherId:2 },
    { id:15, name:"Oficina", img:"", fatherId:2 },
    { id:16, name:"Carpetas ", img:"", fatherId:2 },
    { id:17, name:"Adhesivos", img:"", fatherId:2 },
    { id:18, name:"Articulos de Arte", img:"", fatherId:2 },
    { id:19, name:"Regalos y felicitaciones", img:"", fatherId:2 },
    { id:20, name:"Manualidades", img:"", fatherId:2 },

    // ============ SUBCATEGORÍAS DE DISCOS Y COLECCIONISMO (id:3) ============

    { id:21, name:"Vinilos", img:"", fatherId:3 },
    { id:22, name:"CDs", img:"", fatherId:3 },
    { id:23, name:"Casetes", img:"", fatherId:3 },
    { id:24, name:"Películas", img:"", fatherId:3 },
    { id:25, name:"Merchandising", img:"", fatherId:3 },
    { id:26, name:"Musica", img:"", fatherId:3 },
    { id:27, name:"Series", img:"", fatherId:3 },

    // ============ SUBCATEGORÍAS DE ROPA (id:4) ============

    { id:28, name:"Ropa para Hombre", img:"", fatherId:4 },
    { id:29, name:"Ropa para Mujer", img:"", fatherId:4 },
    { id:30, name:"Ropa Infantil", img:"", fatherId:4 },
    { id:31, name:"Ropa para Bebé", img:"", fatherId:4 },
    { id:32, name:"Camisas", img:"", fatherId:4 },
    { id:33, name:"Pantalones", img:"", fatherId:4 },
    { id:34, name:"Zapateria", img:"", fatherId:4 },
    { id:35, name:"Ropa Interior", img:"", fatherId:4 },
    { id:36, name:"Accesorios", img:"", fatherId:4 },

    // ============ SUBCATEGORÍAS DE CARPINTERÍA (id:5) ============

    { id:37, name:"Marcos ", img:"", fatherId:5 },
    { id:38, name:"Puertas de Madera", img:"", fatherId:5 },
    { id:39, name:"Tablas y Madera", img:"", fatherId:5 },
    { id:40, name:"Muebleria", img:"", fatherId:5 },
    { id:41, name:"Decoración", img:"", fatherId:5 },
];

export const MOCK_PRODUCTS:ProductInterface[] = [
    // ============ PRODUCTOS MÁS VENDIDOS (primeros en el array) ============
    {
        id:1,
        name:"Tomate frito casero en tarro de vidrio",
        description:"",
        img:[
            ""
        ],
        video:[],
        price:1,
        categories:[
            {   id:1,	name:"Ultramarinos",	img:""},
            {   id:11,	name:"Conservas ",	img:"",	fatherId:1}
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:2,
        name:"Mermelada de frutos del bosque artesanal",
        description:"",	
        img:[
            ""
        ],
        video:[],
        price:1,
        categories:[
            {   id:1,	name:"Ultramarinos",	img:""},
            {   id:11,	name:"Conservas ",	img:"",	fatherId:1}
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:3,
        name:"Pimientos del piquillo confitados",
        description:"",	
        img:[
            ""
        ],
        video:[],
        price:1,
        categories:[
            {   id:1,	name:"Ultramarinos",	img:""},
            {   id:11,	name:"Conservas ",	img:"",	fatherId:1}
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:4,
        name:"Lentejas pardinas a granel",
        description:"",	
        img:[
            ""
        ],
        video:[],
        price:1,
        categories:[
            {   id:1,	name:"Ultramarinos",	img:""},
            {   id:12,	name:"Legumbres",	img:"",	fatherId:1}
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:5,
        name:"Garbanzos ecológicos en saco de tela",
        description:"",	
        img:[
            ""
        ],
        video:[],
        price:1,
        categories:[
            {   id:1,	name:"Ultramarinos",	img:""},
            {   id:12,	name:"Legumbres",	img:"",	fatherId:1}
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:6,
        name:"Alubias blancas seleccionadas",
        description:"",	
        img:[
            ""
        ],
        video:[],
        price:1,
        categories:[
            {   id:1,	name:"Ultramarinos",	img:""},
            {   id:12,	name:"Legumbres",	img:"",	fatherId:1}
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:7,
        name:"Chorizo curado de elaboración propia",
        description:"",	
        img:[
            ""
        ],
        video:[],
        price:1,
        categories:[
            {   id:1,	name:"Ultramarinos",	img:""},
            {   id:13,	name:"Embutidos",	img:"",	fatherId:1}
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:8,
        name:"Salchichón ibérico artesanal",
        description:"",	img:[
            ""
        ],
        video:[],
        price:1,
        categories:[
            {   id:1,	name:"Ultramarinos",	img:""},
            {   id:13,	name:"Embutidos",	img:"",	fatherId:1}
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:9,
        name:"Morcilla de cebolla local",
        description:"",	
        img:[
            ""
        ],
        video:[],
        price:1,
        categories:[
            {   id:1,	name:"Ultramarinos",	img:""},
            {   id:13,	name:"Embutidos",	img:"",	fatherId:1}
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:10,
        name:"Cervesa",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:1,	name:"Ultramarinos",	img:""},
                {   id:14,	name:"Vinos y licores",	img:"",	fatherId:1},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:11,
        name:"Licor de hierbas ",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:1,	name:"Ultramarinos",	img:""},
                {   id:14,	name:"Vinos y licores",	img:"",	fatherId:1},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:12,
        name:"Vino dulce",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:1,	name:"Ultramarinos",	img:""},
                {   id:14,	name:"Vinos y licores",	img:"",	fatherId:1},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:13,
        name:"Aceite de oliva virgen extra prensado en frío",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:1,	name:"Ultramarinos",	img:""},
                {   id:15,	name:"Aceites y vinagres",	img:"",	fatherId:1},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:14,
        name:"Vinagre de manzana fermentado natural",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:1,	name:"Ultramarinos",	img:""},
                {   id:15,	name:"Aceites y vinagres",	img:"",	fatherId:1},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:15,
        name:"Aceite infusionado con romero y ajo",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:1,	name:"Ultramarinos",	img:""},
                {   id:15,	name:"Aceites y vinagres",	img:"",	fatherId:1},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:16,
        name:"Hogaza de masa madre",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:1,	name:"Ultramarinos",	img:""},
                {   id:16,	name:"Pan / bollería",	img:"",	fatherId:1},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:17,
        name:"Pan de higo",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:1,	name:"Ultramarinos",	img:""},
                {   id:16,	name:"Pan / bollería",	img:"",	fatherId:1},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:18,
        name:"Polvorones hechos a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:1,	name:"Ultramarinos",	img:""},
                {   id:16,	name:"Pan / bollería",	img:"",	fatherId:1},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:19,
        name:"Turrón de almendra artesanal",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:1,	name:"Ultramarinos",	img:""},
                {   id:16,	name:"Pan / bollería",	img:"",	fatherId:1},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:20,
        name:"Cartulinas texturizadas hechas con papel reciclado",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:17,	name:"Cartulinas",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:21,
        name:"Cartulina ",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:17,	name:"Cartulinas",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:22,
        name:"Packs de cartulina de colores artesanales",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:17,	name:"Cartulinas",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:23,
        name:"Estuche ",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:18,	name:"Útiles escolares",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:24,
        name:"Regla ",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:18,	name:"Útiles escolares",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:25,
        name:"Lapiz",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:18,	name:"Útiles escolares",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:26,
        name:"Cuaderno cosido a mano con papel reciclado",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:19,	name:"Libretas / cuadernos",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:27,
        name:"Libreta con cubierta de cuero reciclado",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:19,	name:"Libretas / cuadernos",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:28,
        name:"Diario con tapa de madera grabada",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:19,	name:"Libretas / cuadernos",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:29,
        name:"Soporte para bolígrafos de cerámica",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:20,	name:"Material de oficina",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:30,
        name:"Organizadores de escritorio de madera",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:20,	name:"Material de oficina",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:31,
        name:"Clips de papel decorativos artesanales",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:20,	name:"Material de oficina",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:32,
        name:"Carpeta de cartón reciclado encuadernada a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:21,	name:"Carpetas",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:33,
        name:"Carpeta de fieltro cosida artesanalmente",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:21,	name:"Carpetas",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:34,
        name:"Carpeta con diseño pintado a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:21,	name:"Carpetas",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:35,
        name:"Pegamento madera",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:22,	name:"Adhesivos",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:36,
        name:"Stickers ",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:22,	name:"Adhesivos",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:37,
        name:"Posits",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:22,	name:"Adhesivos",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:38,
        name:"Acuarelas ",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:23,	name:"Artículos de arte ",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:39,
        name:"Pinceles con mango de bambú",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:23,	name:"Artículos de arte ",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:40,
        name:"Lápices de colores hechos con madera reciclada",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:23,	name:"Artículos de arte ",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:41,
        name:"Tarjetas de cumpleaños pintadas a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:24,	name:"Regalos y felicitaciones",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:42,
        name:"Sobres ilustrados con tinta vegetal",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:24,	name:"Regalos y felicitaciones",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:43,
        name:"Kit para hacer velas artesanales",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:25,	name:"Manualidades",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:44,
        name:"Kit de bordado para principiantes",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:25,	name:"Manualidades",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:45,
        name:"Caja de cuentas de madera pintadas a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:2,	name:"Papelerías",	img:""},
                {   id:25,	name:"Manualidades",	img:"",	fatherId:2},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:46,
        name:"Álbum de banda local prensado en vinilo",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:26,	name:"Vinilos",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:47,
        name:"Edición limitada de vinilo",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:26,	name:"Vinilos",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:48,
        name:"Vinilo recopilatorio de músicos independientes",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:26,	name:"Vinilos",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:49,
        name:"Álbum acústico de artista local",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:27,	name:"CD’s",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:50,
        name:"CD promocional con arte impreso a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:27,	name:"CD’s",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:51,
        name:"Disco con grabaciones en vivo de conciertos pequeños",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:27,	name:"CD’s",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:52,
        name:"Cassette edición limitada de música indie",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:28,	name:"Casetes",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:53,
        name:"Cassette grabado y decorado artesanalmente",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:28,	name:"Casetes",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:54,
        name:"Reedición casete de banda underground local",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:28,	name:"Casetes",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:55,
        name:"Documental de autor ",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:29,	name:"Películas",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:56,
        name:"DVD de cine experimental independiente",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:29,	name:"Películas",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:57,
        name:"Camiseta serigrafiada por artistas locales",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:30,	name:"Merch",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:58,
        name:"Tote bag con logo de banda local",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:30,	name:"Merch",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:59,
        name:"Láminas firmadas por músicos",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:30,	name:"Merch",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:60,
        name:"Álbum digital con descarga en tarjeta física",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:31,	name:"Música",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:61,
        name:"Canción personalizada grabada por artista local",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:31,	name:"Música",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:62,
        name:"EP acústico de producción independiente",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:31,	name:"Música",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:63,
        name:"Serie web recopilada en DVD artesanal",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:32,	name:"Series",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:64,
        name:"Merch de series locales:pines, postales",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:32,	name:"Series",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:65,
        name:"Banda sonora original en CD",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:3,	name:"Discos",	img:""},
                {   id:32,	name:"Series",	img:"",	fatherId:3},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:66,
        name:"Camisa marengo",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:33,	name:"Hombre",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:67,
        name:"Chaleco tejido artesanalmente",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:33,	name:"Hombre",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:68,
        name:"Cinturón de cuero trabajado a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:33,	name:"Hombre",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:69,
        name:"Falda bohemia cosida artesanalmente",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:34,	name:"Mujer",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:70,
        name:"Blusa de algodón orgánico",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:34,	name:"Mujer",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:71,
        name:"Bufanda de lana hilada a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:34,	name:"Mujer",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:72,
        name:"Camiseta de algodón organico",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:35,	name:"Niños",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:73,
        name:"Conjunto de ropa de bebé hecho a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:35,	name:"Niños",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:74,
        name:"Gorro de lana para niño/a",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:35,	name:"Niños",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:75,
        name:"Pelele de tela ecológica",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:36,	name:"Infantes",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:76,
        name:"Manta tejida a crochet",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:36,	name:"Infantes",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:77,
        name:"Babero reversible artesanal",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:36,	name:"Infantes",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:78,
        name:"Camisa de lino bordada a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:37,	name:"Camisas",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:79,
        name:"Camisa con estampado artesanal (block print)",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:37,	name:"Camisas",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:80,
        name:"Camisa reciclada upcycled",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:37,	name:"Camisas",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:81,
        name:"Pantalón ancho de algodón orgánico",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:38,	name:"Pantalones",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:82,
        name:"Pantalón reciclado con parches",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:38,	name:"Pantalones",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:83,
        name:"Bombachos de lino artesanal",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:38,	name:"Pantalones",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:84,
        name:"Alpargatas hechas a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:39,	name:"Zapatos",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:85,
        name:"Sandalias de cuero artesano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:39,	name:"Zapatos",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:86,
        name:"Zapatillas cosidas con tela reciclada",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:39,	name:"Zapatos",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:87,
        name:"Ropa interior de algodón orgánico",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:40,	name:"Interiores",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:88,
        name:"Bralette artesanal sin aros",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:40,	name:"Interiores",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:89,
        name:"Calzoncillos de tela natural",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:40,	name:"Interiores",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:90,
        name:"Cinturones de tela o cuero reciclado",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:41,	name:"Accesorios",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:91,
        name:"Gorro de lana hecho a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:41,	name:"Accesorios",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:92,
        name:"Bolsos tejidos con fibras naturales",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:4,	name:"Ropa:",	img:""},
                {   id:41,	name:"Accesorios",	img:"",	fatherId:4},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:93,
        name:"Marco de fotos tallado a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:42,	name:"Marcos",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:94,
        name:"Marco con barniz ecológico",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:42,	name:"Marcos",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:95,
        name:"Marco decorativo de madera reciclada",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:42,	name:"Marcos",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:96,
        name:"Puerta de roble artesanal",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:43,	name:"Puertas",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:97,
        name:"Puerta rústica con herrajes forjados",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:43,	name:"Puertas",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:98,
        name:"Puerta corrediza tipo granero",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:43,	name:"Puertas",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:99,
        name:"Tabla de olivo",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:44,	name:"Maderas",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:100,
        name:"Tablas de pino",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:44,	name:"Maderas",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:101,
        name:"madera maciza",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:44,	name:"Maderas",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:102,
        name:"Mesa de comedor hecha a mano",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:45,	name:"Mueblería",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:103,
        name:"Estantería modular artesanal",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:45,	name:"Mueblería",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:104,
        name:"Silla de diseño con madera local",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:45,	name:"Mueblería",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:105,
        name:"Lámpara colgante de madera torneada",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:46,	name:"Decoración en madera",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:106,
        name:"Reloj de pared rústico",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:46,	name:"Decoración en madera",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:107,
        name:"Letras decorativas talladas",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:46,	name:"Decoración en madera",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:108,
        name:"Organizadores de escritorio de madera",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:46,	name:"Decoración en madera",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
    {
        id:109,
        name:"Diario con tapa de madera grabada",
        description:"",
        img:[
            ""	
        ],
        video:[],
        price:1,
        categories:[
                {   id:5,	name:"Carpintería:",	img:""},
                {   id:46,	name:"Decoración en madera",	img:"",	fatherId:5},
        ],
        vendedor:{id:1,name:"a", img:""},
    },
];

export const MOCK_VENDORS:VendedorInterface[] = [
    { id:1, name:"TechStore Madrid", img:"" },
    { id:2, name:"PhoneShop Barcelona", img:"" },
    { id:3, name:"SportZone", img:"" },
    { id:4, name:"ComputerWorld", img:"" },
    { id:5, name:"CocinaPlus", img:"" },
    { id:6, name:"ModaStyle", img:"" },
    { id:7, name:"XiaomiStore", img:"" },
    { id:8, name:"GoogleStore", img:"" },
    { id:9, name:"LenovoPro", img:"" },
    { id:10, name:"FitnessCenter", img:"" },
    { id:11, name:"ElectroHogar", img:"" },
    { id:12, name:"PhotoPro", img:"" },
    { id:13, name:"GameZone", img:"" },
    { id:14, name:"BikeWorld", img:"" },
    { id:15, name:"LibreriaClasica", img:"" },
];
