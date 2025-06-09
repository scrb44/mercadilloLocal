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
            }/*
            Vendedor vendedorPaco = new Vendedor();
            vendedorPaco.setNombre("Tasca Fuengirola");
            vendedorPaco.setUsuario("TascaMalaquena");
            vendedorPaco.setEmail("tascamalaga@gmail.com");
            vendedorPaco.setTelf("644545467");
            vendedorPaco.setVerificado(true);
            vendedorPaco.setPassword(passwordEncoder.encode("123456")); // Usa encoder si es necesario
            vendedorPaco.setImagen("https://ejemplo.com/tasca.jpg");
            vendedorPaco.setLocalidad(fuengirola);
            vendedorRepo.save(vendedorPaco);*/

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
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Garbanzos ecológicos en saco de tela", new BigDecimal("2.20"), "Garbanzos ecológicos en saco de tela",
                            "https://tienda.verdebioleta.com/img/media/products/216717/imggran.JPG?t=1531156996",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Alubias blancas seleccionadas", new BigDecimal("2.10"), "Alubias blancas seleccionadas",
                            "https://pamplona.e-leclerc.es/documents/10180/10815/8435307400444_G.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Chorizo curado de elaboración propia", new BigDecimal("5.50"), "Chorizo curado de elaboración propia",
                            "https://www.embutidosmaribel.com/wp-content/uploads/2013/04/IMG_6831.jpeg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Salchichón ibérico artesanal", new BigDecimal("5.00"), "Salchichón ibérico artesanal",
                            "https://tentuiberico.es/130-thickbox_default/salchichon-casero-herradura.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Morcilla de cebolla local", new BigDecimal("4.75"), "Morcilla de cebolla local",
                            "https://munoaalimentacion.com/cdn/shop/files/MORCILLA_CEBOLLA_ORMAIZTEGI.jpg?v=1724927744",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

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
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

                    new Producto(null, "Turrón de almendra artesanal", new BigDecimal("5.25"), "Turrón de almendra artesanal",
                            "https://www.vicens.com/cdnassets//Blando-500g_2023-3.jpg",
                            null, List.of(categorias.get("Ultramarinos")), vendedorTasca),

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