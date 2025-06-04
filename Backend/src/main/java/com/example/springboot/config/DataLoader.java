package com.example.springboot.config;

import com.example.springboot.model.Categoria;
import com.example.springboot.model.Producto;
import com.example.springboot.model.Provincia;
import com.example.springboot.model.Vendedor;
import com.example.springboot.repository.CategoriaRepository;
import com.example.springboot.repository.ProductoRepository;
import com.example.springboot.repository.ProvinciaRepository;
import com.example.springboot.repository.VendedorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(ProductoRepository productoRepo,
                                   CategoriaRepository categoriaRepo,
                                   VendedorRepository vendedorRepo,
                                   ProvinciaRepository provinciaRepo, 
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            Map<String, Categoria> categorias = new HashMap<>();

            String[] nombresCategorias = {
                    "Electrónica", "Bebidas", "Dulces y Pasteles", "Patés",
                    "Mieles Andaluzas", "Lácteos", "Conservas", "Bebidas alcohólicas",
                    "Frutos secos", "Frutas"
            };

            for (String nombreCat : nombresCategorias) {
                Categoria cat = new Categoria();
                cat.setNombre(nombreCat);
                categoriaRepo.save(cat);
                categorias.put(nombreCat, cat);
            }

            // Crear o buscar provincia
            Provincia malaga = new Provincia();
            malaga.setNombre("Málaga");
            malaga = provinciaRepo.save(malaga);

            // Crear y guardar el vendedor
            Vendedor vendedorTasca = new Vendedor();
            vendedorTasca.setNombre("Tasca Malagueña");
            vendedorTasca.setUsuario("TascaMalaquena");
            vendedorTasca.setEmail("tascamalaga@gmail.com");
            vendedorTasca.setTelf("644545467");
            vendedorTasca.setVerificado(true);
            vendedorTasca.setPassword(passwordEncoder.encode("123456"));
            vendedorTasca.setImagen("https://ejemplo.com/tasca.jpg");
            vendedorTasca.setProvincia(malaga); // ✅ Asignar provincia
            vendedorTasca = vendedorRepo.save(vendedorTasca);

            // Producto 1
            Producto prod1 = new Producto();
            prod1.setNombre("Auriculares");
            prod1.setDescripcion("Auriculares inalámbricos");
            prod1.setPrecio(new BigDecimal("59.99"));
            prod1.setImagen("https://sony.scene7.com/is/image/sonyglobalsolutions/WH-CH520_Product_intro_Pink_01_M?$productIntroPlatemobile$&fmt=png-alpha");
            prod1.setCategorias(List.of(categorias.get("Electrónica")));
            prod1.setVendedor(vendedorTasca); // ✅ asignar vendedor
            productoRepo.save(prod1);

            // Producto 2
            Producto prod2 = new Producto();
            prod2.setNombre("Vino Moscatel Dulce Natural – Cartojal");
            prod2.setDescripcion("Vino dulce elaborado con uva Moscatel de la Axarquía malagueña. Ideal para acompañar postres.");
            prod2.setPrecio(new BigDecimal("14.59"));
            prod2.setImagen("https://www.comprar-bebidas.com/media/catalog/product/c/a/cartojal.jpg");
            prod2.setCategorias(List.of(categorias.get("Bebidas")));
            prod2.setVendedor(vendedorTasca); // ✅ asignar vendedor
            productoRepo.save(prod2);

            // Producto 3
            Producto prod3 = new Producto();
            prod3.setNombre("Tortas de Aceite Artesanales – Carmen Lupiañez");
            prod3.setDescripcion("Tradicional torta de aceite elaborada con aceite de oliva virgen extra de la variedad hojiblanca.");
            prod3.setPrecio(new BigDecimal("4.25"));
            prod3.setImagen("https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202401/19/00120660909100____4__600x600.jpg");
            prod3.setCategorias(List.of(categorias.get("Dulces y Pasteles")));
            prod3.setVendedor(vendedorTasca); // ✅ asignar vendedor
            productoRepo.save(prod3);

            // Producto 4
            Producto prod4 = new Producto();
            prod4.setNombre("Paté Ibérico – Iberitos");
            prod4.setDescripcion("Paté artesanal elaborado con hígado de cerdo ibérico, carne y grasa de cerdo ibérico, cebolla y leche.");
            prod4.setPrecio(new BigDecimal("4.30"));
            prod4.setImagen("https://www.iberitos.com/www/wp-content/uploads/2018/08/pate-iberico.png");
            prod4.setCategorias(List.of(
                    categorias.get("Patés"),
                    categorias.get("Conservas")
            ));

            prod4.setVendedor(vendedorTasca); // ✅ asignar vendedor
            productoRepo.save(prod4);

    // Producto 5: Miel de Caña de Azúcar – Frutitos (Mieles Andaluzas)
            Producto prod5 = new Producto();
            prod5.setNombre("Miel de Caña de Azúcar – Frutitos");
            prod5.setDescripcion("Miel extraída del jugo de la caña de azúcar, típica de la región andaluza.");
            prod5.setPrecio(new BigDecimal("6.97"));
            prod5.setImagen("https://www.frutitos.com/9119-medium_default/miel-de-cana-de-azucar-920-gramos.jpg");
            prod5.setCategorias(List.of(categorias.get("Mieles Andaluzas")));
            vendedorTasca.setNombre("Tasca Malagueña");
            productoRepo.save(prod5);

            // Producto 6: Queso de Cabra Malagueño (Lácteos)
            Producto prod6 = new Producto();
            prod6.setNombre("Queso de Cabra Malagueño");
            prod6.setDescripcion(
                    "Queso artesanal elaborado con leche de cabra autóctona, reconocido por su sabor intenso y textura cremosa.");
            prod6.setPrecio(new BigDecimal("20.00")); // Precio medio entre 15 y 25
            prod6.setImagen("https://www.jamoneriajoseluisromero.com/wp-content/uploads/2021/02/queso-rey-cabra.jpg");
            prod6.setCategorias(List.of(categorias.get("Lácteos")));
            vendedorTasca.setNombre("Tasca Malagueña");
            productoRepo.save(prod6);

            // Producto 7: Aceituna Aloreña de Málaga (Conservas)
            Producto prod7 = new Producto();
            prod7.setNombre("Aceituna Aloreña de Málaga");
            prod7.setDescripcion(
                    "Aceituna autóctona con Denominación de Origen Protegida, curada con hierbas aromáticas como el hinojo y el tomillo.");
            prod7.setPrecio(new BigDecimal("6.50")); // Precio medio entre 5 y 8
            prod7.setImagen(
                    "https://www.bonbouquet.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/7/0/70071701.png");
            prod7.setCategorias(List.of(categorias.get("Conservas")));

            vendedorTasca.setNombre("Tasca Malagueña");
            productoRepo.save(prod7);

            // Producto 8: Vino Dulce de Málaga (Bebidas alcohólicas)
            Producto prod8 = new Producto();
            prod8.setNombre("Vino Dulce de Málaga");
            prod8.setDescripcion(
                    "Vino tradicional elaborado con uvas moscatel, caracterizado por su sabor dulce y aroma floral.");
            prod8.setPrecio(new BigDecimal("14.00")); // Precio medio entre 8 y 20
            prod8.setImagen(
                    "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/201907/15/00118720300724____1__600x600.jpg");
            prod8.setCategorias(List.of(categorias.get("Bebidas alcohólicas")));
            productoRepo.save(prod8);

            // Producto 9: Pasas de Málaga (Frutos secos)
            Producto prod9 = new Producto();
            prod9.setNombre("Pasas de Málaga");
            prod9.setDescripcion(
                    "Uvas moscatel secadas al sol en paseros, con Denominación de Origen, reconocidas por su sabor dulce y textura jugosa.");
            prod9.setPrecio(new BigDecimal("8.00")); // Precio medio entre 6 y 10
            prod9.setImagen("https://www.anywaywinebar.com/wp-content/uploads/2021/03/PASAS-DE-MALAGA.jpg");
            prod9.setCategorias(List.of(categorias.get("Frutos secos")));
            productoRepo.save(prod9);

            // Producto 10: Mango de la Axarquía (Frutas)
            Producto prod10 = new Producto();
            prod10.setNombre("Mango de la Axarquía");
            prod10.setDescripcion("Fruta tropical de pulpa jugosa y dulce, cultivada en la comarca de la Axarquía.");
            prod10.setPrecio(new BigDecimal("4.00")); // Precio medio entre 3 y 5
            prod10.setImagen(
                    "https://huertadepancha.com/wp-content/uploads/2020/10/Comprar-Mango-Irwin-a-domicilio-1.jpg");
            prod10.setCategorias(List.of(categorias.get("Frutas")));
            productoRepo.save(prod10);

            System.out.println("Todos los productos y categorías fueron cargados en la base de datos.");
        };
    }
}
