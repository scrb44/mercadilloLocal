import {
    type ProductInterface,
    type CategoryInterface,
    type VendedorInterface,
} from "../types/types";

export const MOCK_PRODUCTS: ProductInterface[] = [
    {
        id: 1,
        name: "iPhone 13 Pro",
        description: "Smartphone Apple con cámara profesional",
        img: [
            "https://www.powerplanetonline.com/cdnassets/apple_iphone_13_pro_grafito_01_l.jpg",
        ],
        video: [],
        price: 999,
        categories: [{ id: 1, name: "Electrónicos", img: "" }],
        vendedor: { id: 1, name: "TechStore Madrid", img: "" },
    },
    {
        id: 2,
        name: "Samsung Galaxy S22",
        description: "Teléfono Android de última generación",
        img: ["https://m.media-amazon.com/images/I/714LtBc8KzL.jpg"],
        video: [],
        price: 799,
        categories: [{ id: 1, name: "Electrónicos", img: "" }],
        vendedor: { id: 2, name: "PhoneShop Barcelona", img: "" },
    },
    {
        id: 3,
        name: "MacBook Air M2",
        description: "Portátil Apple con chip M2",
        img: ["https://techcrunch.com/wp-content/uploads/2022/07/CMC_1580.jpg"],
        video: [],
        price: 1299,
        categories: [{ id: 2, name: "Informática", img: "" }],
        vendedor: { id: 1, name: "TechStore Madrid", img: "" },
    },
    {
        id: 4,
        name: "Nike Air Max",
        description: "Zapatillas deportivas cómodas",
        img: [
            "https://i1.t4s.cz//products/921522-034/nike-air-max-97-gs-715627-921522-034-960.webp",
        ],
        video: [],
        price: 129,
        categories: [{ id: 3, name: "Deportes", img: "" }],
        vendedor: { id: 3, name: "SportZone", img: "" },
    },
];

export const MOCK_CATEGORIES: CategoryInterface[] = [
    { id: 1, name: "Electrónicos", img: "" },
    { id: 2, name: "Informática", img: "" },
    { id: 3, name: "Deportes", img: "" },
    { id: 4, name: "Ropa", img: "" },
    { id: 5, name: "Hogar", img: "" },
];

export const MOCK_VENDORS: VendedorInterface[] = [
    { id: 1, name: "TechStore Madrid", img: "" },
    { id: 2, name: "PhoneShop Barcelona", img: "" },
    { id: 3, name: "SportZone", img: "" },
];
