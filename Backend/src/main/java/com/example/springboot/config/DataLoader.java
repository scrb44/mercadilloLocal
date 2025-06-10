package com.example.springboot.config;

import com.example.springboot.model.Categoria;
import com.example.springboot.model.Localidad;
import com.example.springboot.model.Producto;
import com.example.springboot.model.Vendedor;
import com.example.springboot.repository.CategoriaRepository;
import com.example.springboot.repository.ProductoRepository;
import com.example.springboot.repository.VendedorRepository;
import com.example.springboot.repository.LocalidadRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Order(2)
@Configuration
public class DataLoader {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase(ProductoRepository productoRepo,
                                   CategoriaRepository categoriaRepo,
                                   VendedorRepository vendedorRepo,
                                   LocalidadRepository localidadRepo) {

        return args -> {
            System.out.println("📦 Iniciando carga de productos...");

            // Crear y guardar categorías
            Map<String, Categoria> categorias = new HashMap<>();
            for (String nombre : List.of("Ultramarinos", "Papelerías", "Discos", "Ropa", "Carpinteria")) {
                Categoria cat = new Categoria();
                cat.setNombre(nombre);

                switch (nombre) {
                    case "Ultramarinos" -> cat.setImagen("https://s1.ppllstatics.com/elcorreo/www/multimedia/202002/17/media/cortadas/ultramarinos20-kYXE-U10018206059290B-1248x770@El%20Correo.jpg");
                    case "Papelerías" -> cat.setImagen("https://us.123rf.com/450wm/almaje/almaje1801/almaje180100908/94443196-volver-a-la-escuela-concepto-suministros-de-oficina-de-la-escuela.jpg?ver=6");
                    case "Discos" -> cat.setImagen("https://www.lavanguardia.com/files/og_thumbnail/uploads/2018/02/19/5fa4312eb56bf.jpeg");
                    case "Ropa" -> cat.setImagen("https://sopotey.com/blog/wp-content/uploads/2024/04/ropa-de-marca-original.jpg");
                    case "Carpinteria" -> cat.setImagen("https://miroytengo.es/blog/wp-content/uploads/403-2.jpg");
                }

                categoriaRepo.save(cat);
                categorias.put(nombre, cat);
            }

            // Localidad Málaga
            Localidad malaga = localidadRepo.findByNombre("Málaga");
            if (malaga == null) {
                malaga = new Localidad();
                malaga.setNombre("Málaga");
                malaga.setProvincia("Málaga");
                malaga = localidadRepo.save(malaga);
            }
            Localidad fuengirola = new Localidad();
            fuengirola.setNombre("Fuengirola");
            fuengirola.setProvincia("Málaga");
            localidadRepo.save(fuengirola);

            Localidad ojen = new Localidad();
            ojen.setNombre("Ojen");
            ojen.setProvincia("Málaga");
            localidadRepo.save(ojen);

            Localidad istan = new Localidad();
            istan.setNombre("Istan");
            istan.setProvincia("Málaga");
            localidadRepo.save(istan);

            Localidad coin = new Localidad();
            coin.setNombre("Coin");
            coin.setProvincia("Málaga");
            localidadRepo.save(coin);

            // Vendedor Tasca Malagueña
            Vendedor vendedorTasca = vendedorRepo.findByUsuario("TascaMalaquena");
            if (vendedorTasca == null) {
                vendedorTasca = new Vendedor();
                vendedorTasca.setNombre("Tasca Malagueña");
                vendedorTasca.setUsuario("TascaMalaquena");
                vendedorTasca.setEmail("tascamalaga@gmail.com");
                vendedorTasca.setTelf("644545467");
                vendedorTasca.setVerificado(true);
                vendedorTasca.setPassword(passwordEncoder.encode("123456")); // Usa PasswordEncoder en producción
                vendedorTasca.setImagen("https://ejemplo.com/tasca.jpg");
                vendedorTasca.setLocalidad(malaga);
                vendedorTasca = vendedorRepo.save(vendedorTasca);
                System.out.println("🛍️ Vendedor 'TascaMalaquena' creado.");
            }

            Vendedor vendedorTiendaTradicialAlPeso = vendedorRepo.findByUsuario("TiendaTradicialAlPeso");
            if (vendedorTiendaTradicialAlPeso == null) {
                vendedorTiendaTradicialAlPeso = new Vendedor();
                vendedorTiendaTradicialAlPeso.setNombre("Tienda Tradicial Al Peso");
                vendedorTiendaTradicialAlPeso.setUsuario("Tienda Tradicial");
                vendedorTiendaTradicialAlPeso.setEmail("tradicional@gmail.com");
                vendedorTiendaTradicialAlPeso.setTelf("644549465");
                vendedorTiendaTradicialAlPeso.setVerificado(true);
                vendedorTiendaTradicialAlPeso.setPassword(passwordEncoder.encode("123456")); // Usa PasswordEncoder en producción
                vendedorTiendaTradicialAlPeso.setImagen("https://ejemplo.com/tasca.jpg");
                vendedorTiendaTradicialAlPeso.setLocalidad(malaga);
                vendedorTiendaTradicialAlPeso = vendedorRepo.save(vendedorTiendaTradicialAlPeso);
                System.out.println("🛍️ Vendedor 'vendedorTiendaTradicialAlPeso' creado.");
            }

            // Lista de productos
            List<Producto> productos = List.of(
                    new Producto(null, "Tomate frito casero en tarro de vidrio", new BigDecimal("2.50"), "Tomate frito casero en tarro de vidrio",
                            "https://assets.supermercadosmas.com/img/615x615/product/image/034147/034147.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Mermelada de frutos del bosque artesanal", new BigDecimal("3.75"), "Mermelada de frutos del bosque artesanal",
                            "https://www.lartesana.com/627-large_default/mermelada-de-frutos-bosque.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Pimientos del piquillo confitados", new BigDecimal("4.00"), "Pimientos del piquillo confitados",
                            "https://rosara.com/wp-content/uploads/2023/08/14510-Pimiento-piquillo-confitado-125-ml-e1690964319575.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Lentejas pardinas a granel", new BigDecimal("1.80"), "Lentejas pardinas a granel",
                            "https://ecosdelatierra.es/wp-content/uploads/2021/01/Lenteja-Pardina-Bio-500gr-1024x1024.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTiendaTradicialAlPeso),

                    new Producto(null, "Garbanzos ecológicos en saco de tela", new BigDecimal("2.20"), "Garbanzos ecológicos en saco de tela",
                            "https://tienda.verdebioleta.com/img/media/products/216717/imggran.JPG?t=1531156996",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Alubias blancas seleccionadas", new BigDecimal("2.10"), "Alubias blancas seleccionadas",
                            "https://pamplona.e-leclerc.es/documents/10180/10815/8435307400444_G.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Chorizo curado de elaboración propia", new BigDecimal("5.50"), "Chorizo curado de elaboración propia",
                            "https://www.embutidosmaribel.com/wp-content/uploads/2013/04/IMG_6831.jpeg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTiendaTradicialAlPeso),

                    new Producto(null, "Salchichón ibérico artesanal", new BigDecimal("5.00"), "Salchichón ibérico artesanal",
                            "https://tentuiberico.es/130-thickbox_default/salchichon-casero-herradura.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTiendaTradicialAlPeso),

                    new Producto(null, "Morcilla de cebolla local", new BigDecimal("4.75"), "Morcilla de cebolla local",
                            "https://munoaalimentacion.com/cdn/shop/files/MORCILLA_CEBOLLA_ORMAIZTEGI.jpg?v=1724927744",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTiendaTradicialAlPeso),

                    new Producto(null, "Cerveza Victoria", new BigDecimal("1.50"), "Cerveza",
                            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQMIJXqWcCuJSz32U-eG2SCvZ5dajZm2N-rLQ7gyX77XqtKOYi8hSB8dMzmTy8j2ZxZOBX0W8hI_1axJ4l4s54ehvmwFujlt_4yBFbz2G4RmRMiuHFNzu1XnA",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Licor de hierbas", new BigDecimal("6.00"), "Licor de hierbas",
                            "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202001/28/00118721900951____2__600x600.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Vino dulce", new BigDecimal("4.50"), "Vino dulce",
                            "https://www.enviavinos.com/499-large_default/silvano-garcia-dulce-moscatel-2019.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Aceite de oliva virgen extra prensado en frío", new BigDecimal("7.00"), "Aceite de oliva virgen extra prensado en frío",
                            "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/spt/spt06200/l/8.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Vinagre de manzana fermentado natural", new BigDecimal("3.00"), "Vinagre de manzana fermentado natural",
                            "https://m.media-amazon.com/images/I/51cjvmjxpuL._AC_UF1000,1000_QL80_.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Aceite infusionado con romero y ajo", new BigDecimal("7.50"), "Aceite infusionado con romero y ajo",
                            "https://unolivo.com/wp-content/uploads/2024/05/CondimentoAOVE-infusionado-con-ajo-albahaca-y-romero.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Hogaza de masa madre", new BigDecimal("2.80"), "Hogaza de masa madre",
                            "https://cdn-fornes.aktiosdigitalservices.com/tol/fornes/media/product/img/1600x1600/08412600028124.jpg?t=20230718050005",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Pan de higo", new BigDecimal("3.20"), "Pan de higo",
                            "https://www.turronesydulces.com/blog/wp-content/uploads/2019/09/Pan-de-Higo-con-Almendras.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Polvorones hechos a mano", new BigDecimal("4.10"), "Polvorones hechos a mano",
                            "https://m.media-amazon.com/images/I/51f3FU8uf2L._AC_UF1000,1000_QL80_.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTiendaTradicialAlPeso),

                    new Producto(null, "Turrón de almendra artesanal", new BigDecimal("5.25"), "Turrón de almendra artesanal",
                            "https://www.vicens.com/cdnassets//Blando-500g_2023-3.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Vestido floral", new BigDecimal("15.75"), "Vestido para primavera, de algodón",
                            "https://m.media-amazon.com/images/I/71fc85EerCL._AC_UY1000_.jpg",
                            null, List.of(categorias.get("Ropa")), vendedorTasca),

                    new Producto(null, "Martillo bellota", new BigDecimal("6.75"), "Martillo de mango de madera",
                            "https://www.ferrokey.eu/media/catalog/product/cache/fd00e0b96a1c32b265511e0d53330673/1/3/13987.jpg",
                            null, List.of(categorias.get("Carpinteria")), vendedorTasca),


                    new Producto(null, "Camiseta artesanal", new BigDecimal("10.50"), "Camiseta de algodón orgánico con diseño estampado a mano",
                            "https://themisiaproject.com/cdn/shop/products/Camiseta-Misia-01-copia_2000x.jpg?v=1586219995",
                            null, List.of(categorias.get("Ropa")), vendedorTasca),

                    new Producto(null, "Pantalón de lino", new BigDecimal("18.90"), "Pantalón fresco ideal para verano, hecho a mano",
                            "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTUgKlexjMlqoTaMD-1Vlrci6yf7-z1v2xqSTQ-muB_G4uMn5znwGh-gFy3tVIpRuulio-gg7yH5NYYy542P-cGoH5gW9F6Stx2ALy9987PUgkbEiYC5aOLND5imJ7JOp_COGGnCAo&usqp=CAc",
                            null, List.of(categorias.get("Ropa")), vendedorTasca),

                    new Producto(null, "Gorro tejido a mano", new BigDecimal("7.25"), "Gorro de lana merino tejido",
                            "https://i.etsystatic.com/22182062/r/il/c3d966/3388120069/il_570xN.3388120069_srj2.jpg",
                            null, List.of(categorias.get("Ropa")), vendedorTasca),


                    new Producto(null, "Banco de madera reciclada", new BigDecimal("25.00"), "Banco hecho con madera reciclada de palets",
                            "https://m.media-amazon.com/images/I/51ZQU8N8qFL._AC_UF894,1000_QL80_.jpg",
                            null, List.of(categorias.get("Carpinteria")), vendedorTasca),

                    new Producto(null, "Estantería rústica", new BigDecimal("35.50"), "Estantería de pino con acabado natural, ideal para cocinas o talleres",
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVa8K-ksYBQw3VuLeh4uw4aOcINb7Ck0oxbQ&s",
                            null, List.of(categorias.get("Carpinteria")), vendedorTasca),

                    new Producto(null, "Juego de cucharas de madera", new BigDecimal("9.99"), "Cucharas talladas a mano para cocina o decoración",
                            "https://m.media-amazon.com/images/I/71CiF-wu-HL._AC_UF894,1000_QL80_.jpg",
                            null, List.of(categorias.get("Carpinteria")), vendedorTasca),

                    new Producto(null, "Cuaderno artesanal", new BigDecimal("5.25"), "Cuaderno hecho a mano con papel reciclado y tapa de cartón ilustrado",
                            "https://blog.oxfamintermon.org/wp-content/uploads/2017/03/libretas-artesanales.jpg",
                            null, List.of(categorias.get("Papelerías")), vendedorTasca),

                    new Producto(null, "Bolígrafo ecológico", new BigDecimal("1.20"), "Bolígrafo con cuerpo de cartón reciclado y tinta azul",
                            "https://cdn.laimprentacg.com/compra2/pro/products/115/2023/4/13/boligrafos-ecologicos-2102-02-negro.jpeg",
                            null, List.of(categorias.get("Papelerías")), vendedorTasca),

                    new Producto(null, "Cartuchera de tela", new BigDecimal("4.75"), "Cartuchera cosida a mano por emprendedora local, tela de jean reciclado",
                            "https://blog.trapitos.com.ar/uploads/2018/05/cartuchera-de-tela-con-lunares.jpg",
                            null, List.of(categorias.get("Papelerías")), vendedorTasca),

                    new Producto(null, "Set de marcadores pastel", new BigDecimal("3.90"), "Set de 6 marcadores en tonos suaves, ideal para apuntes",
                            "https://starplast.es/wp-content/uploads/2024/07/set-6-marcadores-pastel-colores.jpg",
                            null, List.of(categorias.get("Papelerías")), vendedorTasca),

                    new Producto(null, "Planner semanal", new BigDecimal("6.80"), "Planner de escritorio hecho por diseñadora gráfica local",
                            "https://www.paperly.cl/cdn/shop/products/Plannerpastel_Mesadetrabajo1copia3_900x.png?v=1611239059",
                            null, List.of(categorias.get("Papelerías")), vendedorTasca),

                    new Producto(null, "Lapicera de madera", new BigDecimal("2.50"), "Lapicera hecha a mano con madera recuperada por carpintería barrial",
                            "https://www.regalopublicidad.com/images/1hy14/1dd4365e2e60083432f52121bb0d/610-460/estuche-de-boligrafo-y-lapiz-en-madera-barato-madera.jpg",
                            null, List.of(categorias.get("Papelerías")), vendedorTasca),

                    new Producto(null, "Vinilo - Charly García: Clics Modernos", new BigDecimal("22.00"), "Edición remasterizada del clásico de 1983, ícono del rock argentino",
                            "https://i.ebayimg.com/images/g/G1gAAOSwDQFjLLgg/s-l400.jpg",
                            null, List.of(categorias.get("Discos")), vendedorTasca),

                    new Producto(null, "Vinilo - The Beatles: Abbey Road", new BigDecimal("28.50"), "Edición de colección del histórico álbum de 1969",
                            "https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/201909/02/00105112610232____1__1200x1200.jpg",
                            null, List.of(categorias.get("Discos")), vendedorTasca),

                    new Producto(null, "Vinilo - Soda Stereo: Signos", new BigDecimal("19.90"), "Uno de los discos más influyentes del rock en español",
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSng7egmajJjq5F-tjdzk-0cWsLn9Lbgqw6yA&s",
                            null, List.of(categorias.get("Discos")), vendedorTasca),

                    new Producto(null, "Vinilo - Pink Floyd: The Dark Side of the Moon", new BigDecimal("26.75"), "Versión en vinilo de 180 gramos, sonido envolvente",
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJhs9NXz2aG7mLGNyfBe5X75eSjwJnlOwhcg&s",
                            null, List.of(categorias.get("Discos")), vendedorTasca),

                    new Producto(null, "Vinilo - Mercedes Sosa: Gracias a la vida", new BigDecimal("18.00"), "Antología de la voz más representativa del folclore latinoamericano",
                            "https://cloud10.todocoleccion.online/discos-vinilo/tc/2023/06/04/10/414715954_tcimg_880EE091.jpg?r=1",
                            null, List.of(categorias.get("Discos")), vendedorTasca),

                    new Producto(null, "Vinilo - Queen: Greatest Hits", new BigDecimal("30.00"), "Compilado clásico con los mayores éxitos de la banda británica",
                            "https://m.media-amazon.com/images/I/81S1Mr3RyoL._UF1000,1000_QL80_.jpg",
                            null, List.of(categorias.get("Discos")), vendedorTasca),


                    new Producto(null, "Cartulinas texturizadas hechas con papel reciclado", new BigDecimal("1.80"), "Cartulinas texturizadas hechas con papel reciclado",
                            "https://ritarita.es/wp-content/uploads/2023/08/carta-de-colores-cartulina-texturizada2.jpg",
                            null, List.of(categorias.get("Papelerías")), vendedorTasca)
            );

            // Guardar productos en la base de datos
            productoRepo.saveAll(productos);

            System.out.println("✔️ Productos y categorías cargados correctamente.");
        };
    }
}