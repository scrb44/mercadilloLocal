import React, { useRef, useState } from "react";
import { useUser } from "../../contexts";
import styles from "./perfil.module.css";
import Header from "../../componentes/header"; // Asegúrate de que la ruta sea correcta

const Perfil: React.FC = () => {
  const { user, isAuthenticated } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    return <p>No has iniciado sesión.</p>;
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Header />
      <div className={styles.profileContainer}>
        <h2 className={styles.title}>👤 Perfil de {user.role}</h2>

        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <img
              src={
                profileImage ||
                "https://media.istockphoto.com/id/1495088043/es/vector/icono-de-perfil-de-usuario-avatar-o-icono-de-persona-foto-de-perfil-s%C3%ADmbolo-de-retrato.jpg?s=612x612&w=0&k=20&c=mY3gnj2lU7khgLhV6dQBNqomEGj3ayWH-xtpYuCXrzk="
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
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Usuario:</strong> {user.usuario}</p>
            <p><strong>Nombre:</strong> {user.nombre}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.telf && <p><strong>Teléfono:</strong> {user.telf}</p>}
            {user.role === "VENDEDOR" && (
              <p><strong>Verificado:</strong> {user.verificado ? "Sí" : "No"}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Perfil;
