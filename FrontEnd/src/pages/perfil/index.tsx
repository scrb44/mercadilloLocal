import React, { useRef, useState, useEffect } from "react";
import { useUser } from "../../contexts";
import styles from "./perfil.module.css";
import Header from "../../componentes/header";
import { useNavigate } from "react-router-dom";
import api from "../../security/axiosConfig";  // Importa tu axios configurado
import Footer from "../../componentes/footer";


const Perfil: React.FC = () => {
  const { user, setUser, isAuthenticated, logout } = useUser(); // Ojo con setUser si tienes
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(user); // Estado local para perfil actualizado

  // Clave para imagen localStorage
  const storageKey = user ? `profileImage_${user.id}` : null;
  const [profileImage, setProfileImage] = useState<string | null>(
    () => (storageKey ? localStorage.getItem(storageKey) : null)
  );

  // Cargar perfil desde API al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      api.get("/perfil")
        .then((response) => {
          setProfileData(response.data);
          if (setUser) setUser(response.data); // Actualiza contexto si tienes esta función
        })
        .catch((error) => {
          console.error("Error al cargar perfil", error);
          // Puedes hacer logout si el token expiró o no es válido
        });
    }
  }, [isAuthenticated, setUser]);

  useEffect(() => {
    if (storageKey) {
      setProfileImage(localStorage.getItem(storageKey));
    } else {
      setProfileImage(null);
    }
  }, [storageKey]);

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
      localStorage.removeItem(storageKey);
    }
    navigate("/", { replace: true });
  };

  if (!isAuthenticated || !profileData) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <>
      <Header />
      <div className={styles.profileContainer}>
        <h2 className={styles.title}>👤 Perfil de {profileData.role}</h2>

        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <img
              src={
                profileImage ||
                profileData.imagen ||
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
            <p><strong>ID:</strong> {profileData.id}</p>
            <p><strong>Usuario:</strong> {profileData.usuario}</p>
            <p><strong>Nombre:</strong> {profileData.nombre}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            {profileData.telf && <p><strong>Teléfono:</strong> {profileData.telf}</p>}
            {profileData.role === "VENDEDOR" && (
              <p><strong>Verificado:</strong> {profileData.verificado ? "Sí" : "No"}</p>
            )}
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
       <Footer />
    </>
  );
};

export default Perfil;
