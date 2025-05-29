// Exportar todos los providers
export { UserProvider, useUser } from "./userContext";
export { CartProvider, useCart } from "./cartContext";

// Solo exportar tipos específicos de contexto si son necesarios
export type { default as UserContextType } from "./userContext";
export type { default as CartContextType } from "./cartContext";

// Exportar los contextos por si alguien los necesita directamente
export { default as UserContext } from "./userContext";
export { default as CartContext } from "./cartContext";
