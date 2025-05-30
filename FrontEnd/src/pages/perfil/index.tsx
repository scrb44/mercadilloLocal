import React from "react";
import { useUser } from "../../contexts";

// Usa el tipo que se ajuste a tu contexto
interface UserInterface {
  id: number;
  role: "COMPRADOR" | "ADMIN" | "VENDEDOR";
  usuario: string;
  nombre: string;
  email: string;
  password?: string;
  telf?: string;
  verificado?: boolean;
}

const Perfil: React.FC = () => {
  const { user, isAuthenticated } = useUser();

  if (!isAuthenticated || !user) {
    return <p>No has iniciado sesión.</p>;
  }

  // Asumimos que user es UserInterface
  const u = user as UserInterface;

  return (
    <div>
      <h2>Perfil de {u.role}</h2>

      <p>ID: {u.id}</p>
      <p>Usuario: {u.usuario}</p>
      <p>Nombre: {u.nombre}</p>
      <p>Email: {u.email}</p>

      {u.role !== "ADMIN" && u.telf && <p>Teléfono: {u.telf}</p>}

      {u.role === "VENDEDOR" && (
        <p>Verificado: {u.verificado ? "Sí" : "No"}</p>
      )}
    </div>
  );
};

export default Perfil;
