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

            Map<String, Categoria> categorias = new HashMap<>();
            for (String nombre : List.of("Ultramarinos", "Papelerías", "Discos", "Ropa", "Carpinteria")) {
                Categoria cat = new Categoria();
                cat.setNombre(nombre);
                categoriaRepo.save(cat);
                categorias.put(nombre, cat);
            }

            Localidad malaga = localidadRepo.findByNombre("Málaga");
            if (malaga == null) {
                malaga = new Localidad();
                malaga.setNombre("Málaga");
                malaga = localidadRepo.save(malaga);
            }

            Vendedor vendedorTasca = vendedorRepo.findByUsuario("TascaMalaquena");
            if (vendedorTasca == null) {
                vendedorTasca = new Vendedor();
                vendedorTasca.setNombre("Tasca Malagueña");
                vendedorTasca.setUsuario("TascaMalaquena");
                vendedorTasca.setEmail("tascamalaga@gmail.com");
                vendedorTasca.setTelf("644545467");
                vendedorTasca.setVerificado(true);
                vendedorTasca.setPassword(passwordEncoder.encode("123456"));// ⚠️ Usa PasswordEncoder en producción
                vendedorTasca.setImagen("https://ejemplo.com/tasca.jpg");
                vendedorTasca.setLocalidad(malaga);
                vendedorTasca = vendedorRepo.save(vendedorTasca);
                System.out.println("🛍️ Vendedor 'TascaMalaquena' creado.");
            }

            List<Producto> productos = List.of(
                    crearProducto("Tomate frito casero en tarro de vidrio", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Mermelada de frutos del bosque artesanal", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Pimientos del piquillo confitados", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Lentejas pardinas a granel", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Garbanzos ecológicos en saco de tela", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Alubias blancas seleccionadas", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Chorizo curado de elaboración propia", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Salchichón ibérico artesanal", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Morcilla de cebolla local", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Cerveza", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Licor de hierbas", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Vino dulce", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Aceite de oliva virgen extra prensado en frío", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Vinagre de manzana fermentado natural", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Aceite infusionado con romero y ajo", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Hogaza de masa madre", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Pan de higo", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Polvorones hechos a mano", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Turrón de almendra artesanal", "Ultramarinos", vendedorTasca, categorias),
                    crearProducto("Cartulinas texturizadas hechas con papel reciclado", "Papelerías", vendedorTasca, categorias)
            );

            productoRepo.saveAll(productos);

            System.out.println("✔️ Productos y categorías cargados correctamente.");
        };
    }

    private Producto crearProducto(String nombre, String categoriaNombre, Vendedor vendedor, Map<String, Categoria> categorias) {
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion("Producto: " + nombre);
        producto.setImagen("https://ejemplo.com/img/" + nombre.toLowerCase().replace(" ", "_") + ".jpg");
        producto.setPrecio(new BigDecimal("1.00"));
        producto.setCategorias(List.of(categorias.get(categoriaNombre)));
        producto.setVendedor(vendedor);
        return producto;
    }
}
