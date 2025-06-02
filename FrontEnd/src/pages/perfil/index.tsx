import React, { useRef, useState, useEffect } from "react";
import { useUser } from "../../contexts";
import styles from "./perfil.module.css";
import Header from "../../componentes/header";
import { useNavigate } from "react-router-dom";

const Perfil: React.FC = () => {
  const { user, isAuthenticated, logout } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Clave única para localStorage según el usuario actual
  const storageKey = user ? `profileImage_${user.id}` : null;

  // Imagen que se puede actualizar y guardar localmente por usuario
  const [profileImage, setProfileImage] = useState<string | null>(
    () => (storageKey ? localStorage.getItem(storageKey) : null)
  );

  // Cuando cambia el usuario, actualizamos la imagen local guardada para ese usuario
  useEffect(() => {
    if (storageKey) {
      setProfileImage(localStorage.getItem(storageKey));
    } else {
      setProfileImage(null);
    }
  }, [storageKey]);

  // Redirigir si no hay sesión
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && storageKey) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        localStorage.setItem(storageKey, imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    logout();
    if (storageKey) {
      localStorage.removeItem(storageKey); // eliminar imagen local al cerrar sesión
    }
    navigate("/", { replace: true });
  };

  if (!isAuthenticated || !user) {
    return null; // Mientras se redirige
  }

  return (
    <>
      <Header />
      <div className={styles.profileContainer}>
        <h2 className={styles.title}>👤 Perfil de {user.role}</h2>

        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <img
              src={
                profileImage || // Imagen guardada localmente para este usuario
                user.imagen || // Imagen que viene del backend
                "https://media.istockphoto.com/id/1495088043/es/vector/icono-de-perfil-de-usuario-avatar-o-icono-de-persona-foto-de-perfil-s%C3%ADmbolo-de-retrato.jpg?s=612x612&w=0&k=20&c=mY3gnj2lU7khgLhV6dQBNqomEGj3ayWH-xtpYuCXrzk=" // Imagen por defecto
              }
              alt="Foto de perfil"
              className={styles.avatar}
            />
            <button onClick={handleClickUpload} className={styles.uploadBtn}>
              Cambiar foto
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <div className={styles.infoSection}>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Usuario:</strong> {user.usuario}
            </p>
            <p>
              <strong>Nombre:</strong> {user.nombre}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.telf && (
              <p>
                <strong>Teléfono:</strong> {user.telf}
              </p>
            )}
            {user.role === "VENDEDOR" && (
              <p>
                <strong>Verificado:</strong> {user.verificado ? "Sí" : "No"}
              </p>
            )}
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Perfil;
