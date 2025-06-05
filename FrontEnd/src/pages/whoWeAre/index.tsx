import React from 'react';
import Header from '../../componentes/header';
import styles from './WhoWeAre.module.css';

interface Herramienta {
  nombre: string;
  img: string;
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
          <ul className={styles.devsList}>
            <li>Doriana Da Costa</li>
            <li>Sofía Ríos</li>
            <li>Santiago Chávez</li>
          </ul>
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
    </>
  );
};

export default WhoWeAre;
