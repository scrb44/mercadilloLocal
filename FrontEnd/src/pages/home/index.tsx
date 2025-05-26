import React, { useEffect, useState } from "react";
import Filter from "../../componentes/filter";
import Footer from "../../componentes/footer";
import Header from "../../componentes/header";

import classes from "./home.module.css";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/productos")  
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(console.error);
  }, []);

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(precio);
  };

  return (
    <div className={classes["home"]}>
      <Header />
      <Filter />
      <h1>Productos más vendidos</h1>

      <main>
        {productos.length === 0 && <p>Cargando productos...</p>}
        <div className={classes["productos-lista"]}>
          {productos.map((producto) => (
            <div key={producto.id} className={classes["producto"]}>
              <h3>{producto.nombre}</h3>
              <img src={producto.imagen} alt={producto.nombre} width={150} />
              <p>{producto.descripcion}</p>
              <p>Precio: {formatearPrecio(producto.precio)}</p>
            </div>
          ))}
        </div>
      </main>
      <div className={classes["home__spacer"]}></div>
      <Footer />
    </div>
  );
}

export default Home;
