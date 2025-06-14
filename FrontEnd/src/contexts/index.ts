// src/contexts/index.ts - ACTUALIZADO CON PAYMENT CONTEXT

// Exportar todos los providers y hooks
export { UserProvider, useUser } from "./userContext";
export { CartProvider, useCart } from "./cartContext";
export { MunicipioProvider, useMunicipio } from "./municipioContext";
export { PaymentProvider, usePayment } from "./paymentContext";

// Solo exportar tipos específicos de contexto si son necesarios
export type { default as UserContextType } from "./userContext";
export type { default as CartContextType } from "./cartContext";
export type { default as MunicipioContextType } from "./municipioContext";

// Exportar los contextos por si alguien los necesita directamente
export { default as UserContext } from "./userContext";
export { default as CartContext } from "./cartContext";
export { default as MunicipioContext } from "./municipioContext";
export { default as PaymentContext } from "./paymentContext";
