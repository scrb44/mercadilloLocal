import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

// 👉 Asegúrate de que la ruta es correcta (ajústala si está en otra carpeta)
import { UserProvider } from "./contexts/UserContext.tsx";

import "./css/main.css";
import "./css/variables.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </StrictMode>
);
