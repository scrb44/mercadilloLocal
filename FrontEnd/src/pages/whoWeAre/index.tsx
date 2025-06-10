// WhoWeAre.tsx

import React from 'react';
import Header from '../../componentes/header';
import Footer from "../../componentes/footer";
import styles from './WhoWeAre.module.css';

interface Herramienta {
  nombre: string;
  img: string;
}

interface Desarrollador {
  nombre: string;
  foto: string;
}

const herramientas: Herramienta[] = [
  { nombre: 'React', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
  { nombre: 'Spring Boot', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1RNgloYivDxu-m0uthmQb78H2ULQhv94GZw&s' },
  { nombre: 'MySQL', img: 'https://www.mysql.com/common/logos/logo-mysql-170x115.png' },
  { nombre: 'GitHub', img: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' },
  { nombre: 'Git', img: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png' },
  { nombre: 'Trello', img: 'https://cdn.worldvectorlogo.com/logos/trello.svg' },
  { nombre: 'Postman', img: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg' },
  { nombre: 'VS Code', img: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg' },
  { nombre: 'IntelliJ', img: 'https://resources.jetbrains.com/storage/products/intellij-idea/img/meta/intellij-idea_logo_300x300.png' }
];

const desarrolladores: Desarrollador[] = [
  {
    nombre: 'Doriana Da Costa',
    foto: 'https://media.licdn.com/dms/image/v2/C4D03AQG0hJ5y882LkA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1643560722400?e=2147483647&v=beta&t=ThcsbLEwki4s1dZGDE1PBjOIAi-VREhC6Hz9EPmfIqk'
  },
  {
    nombre: 'Sofía Ríos',
    foto: 'https://media.licdn.com/dms/image/v2/D4D03AQFP_ljBMTruLw/profile-displayphoto-shrink_200_200/B4DZaVqXSbGgAY-/0/1746267633186?e=2147483647&v=beta&t=J6Z6IUGpZkv0JtH1rwS95_NQtiP3gbESJgZkNi6D6Gk'
  },
  {
    nombre: 'Santiago Chávez',
    foto: 'https://media.licdn.com/dms/image/v2/D4E03AQHww-ZnfxJaYg/profile-displayphoto-shrink_200_200/B4EZbQh5EUHcAY-/0/1747255268297?e=2147483647&v=beta&t=i1fRd0lvCZjOlUFsorOeuBnC5IjPKCkqCbp4Pk2kwqM' 
  }
];

const WhoWeAre: React.FC = () => {
  return (
    <>
      <Header />
      <main className={styles.quienesContainer} role="main" aria-label="Quiénes somos">
        <h1 className={styles.title}>Quiénes Somos</h1>
        <p className={styles.descripcion}>
          Somos un equipo de desarrolladores en formación apasionados por la tecnología, el diseño web y la creación de soluciones digitales. Actualmente estamos cursando un bootcamp intensivo donde aplicamos lo aprendido en proyectos reales como este sitio web.
        </p>

        <section aria-labelledby="devs-title">
          <h2 id="devs-title" className={styles.subtitle}>Desarrolladores</h2>
          <div className={styles.devsGrid}>
            {desarrolladores.map((dev) => (
              <div key={dev.nombre} className={styles.devCard}>
                {dev.foto && (
                  <img src={dev.foto} alt={dev.nombre} className={styles.devFoto} loading="lazy" />
                )}
                <span className={styles.devNombre}>{dev.nombre}</span>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="tools-title">
          <h2 id="tools-title" className={styles.subtitle}>Herramientas Usadas</h2>
          <div className={styles.herramientasGrid}>
            {herramientas.map((h) => (
              <div className={styles.herramienta} key={h.nombre}>
                <img src={h.img} alt={h.nombre} title={h.nombre} loading="lazy" />
                <span>{h.nombre}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WhoWeAre;
