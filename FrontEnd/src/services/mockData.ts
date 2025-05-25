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
            "https://via.placeholder.com/300x200/007bff/ffffff?text=iPhone+13",
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
        img: [
            "https://via.placeholder.com/300x200/28a745/ffffff?text=Samsung+S22",
        ],
        video: [],
        price: 799,
        categories: [{ id: 1, name: "Electrónicos", img: "" }],
        vendedor: { id: 2, name: "PhoneShop Barcelona", img: "" },
    },
    {
        id: 3,
        name: "MacBook Air M2",
        description: "Portátil Apple con chip M2",
        img: [
            "https://via.placeholder.com/300x200/6c757d/ffffff?text=MacBook+Air",
        ],
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
            "https://via.placeholder.com/300x200/dc3545/ffffff?text=Nike+Air+Max",
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
