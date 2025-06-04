package com.example.springboot.config;

import com.example.springboot.model.Categoria;
import com.example.springboot.model.Producto;
import com.example.springboot.model.Vendedor;
import com.example.springboot.repository.CategoriaRepository;
import com.example.springboot.repository.ProductoRepository;
import com.example.springboot.repository.VendedorRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.springboot.repository.LocalidadRepository;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(ProductoRepository productoRepo,
                                   CategoriaRepository categoriaRepo,
                                   VendedorRepository vendedorRepo,
                                  LocalidadRepository localidadRepo) {
        return args -> {
            Map<String, Categoria> categorias = new HashMap<>();


            Categoria cat1= new Categoria();
            cat1.setNombre("Ultramarinos");
            categoriaRepo.save(cat1);
            categorias.put(cat1.getNombre(), cat1);

            Categoria cat2= new Categoria();
            cat2.setNombre("Papelerías");
            categoriaRepo.save(cat2);
            categorias.put(cat2.getNombre(), cat2);

            Categoria cat3= new Categoria();
            cat3.setNombre("Discos");
            categoriaRepo.save(cat3);
            categorias.put(cat3.getNombre(), cat3);

            Categoria cat4= new Categoria();
            cat4.setNombre("Ropa");
            categoriaRepo.save(cat4);
            categorias.put(cat4.getNombre(), cat4);

            Categoria cat5= new Categoria();
            cat5.setNombre("Carpinteria");
            categoriaRepo.save(cat5);
            categorias.put(cat5.getNombre(), cat5);
            // Producto 1: Auriculares (Electrónica)
    // ============ PRODUCTOS MÁS VENDIDOS (primeros en el array) ========
        
        Producto prod1 = new Producto();
        prod1.setNombre("Tomate frito casero en tarro de vidrio");
        prod1.setDescripcion("");
        prod1.setImagen(
            "");
        prod1.setPrecio(new BigDecimal("1"));
        prod1.setCategorias(List.of(categorias.get("Ultramarinos")));
            //{   id:11,    name:"Conservas ",  img:"", fatherId:1}
        productoRepo.save(prod1);
        
        Producto prod2 = new Producto();
        prod2.setNombre("Mermelada de frutos del bosque artesanal");
        prod2.setDescripcion("");   
        prod2.setImagen(
            "");
        prod2.setPrecio(new BigDecimal("1"));
        prod2.setCategorias(List.of(categorias.get("Ultramarinos")));
            //{   id:11,    name:"Conservas ",  img:"", fatherId:1}
        productoRepo.save(prod2);
        
        Producto prod3 = new Producto();
        prod3.setNombre("Pimientos del piquillo confitados");
        prod3.setDescripcion("");   
        prod3.setImagen(
            "");
        prod3.setPrecio(new BigDecimal("1"));
        prod3.setCategorias(List.of(categorias.get("Ultramarinos")));
            //{   id:11,    name:"Conservas ",  img:"", fatherId:1}
        productoRepo.save(prod3);
        
        Producto prod4 = new Producto();
        prod4.setNombre("Lentejas pardinas a granel");
        prod4.setDescripcion("");   
        prod4.setImagen(
            "");
        prod4.setPrecio(new BigDecimal("1"));
        prod4.setCategorias(List.of(categorias.get("Ultramarinos")));
            //{   id:12,    name:"Legumbres",   img:"", fatherId:1}
        productoRepo.save(prod4);
        
        Producto prod5 = new Producto();
        prod5.setNombre("Garbanzos ecológicos en saco de tela");
        prod5.setDescripcion("");   
        prod5.setImagen(
            "");
        prod5.setPrecio(new BigDecimal("1"));
        prod5.setCategorias(List.of(categorias.get("Ultramarinos")));
            //{   id:12,    name:"Legumbres",   img:"", fatherId:1}
        productoRepo.save(prod5);
        
        Producto prod6 = new Producto();
        prod6.setNombre("Alubias blancas seleccionadas");
        prod6.setDescripcion("");   
        prod6.setImagen(
            "");
        prod6.setPrecio(new BigDecimal("1"));
        prod6.setCategorias(List.of(categorias.get("Ultramarinos")));
            //{   id:12,    name:"Legumbres",   img:"", fatherId:1}
        productoRepo.save(prod6);
        
        Producto prod7 = new Producto();
        prod7.setNombre("Chorizo curado de elaboración propia");
        prod7.setDescripcion("");   
        prod7.setImagen(
            "");
        prod7.setPrecio(new BigDecimal("1"));
        prod7.setCategorias(List.of(categorias.get("Ultramarinos")));
            //{   id:13,    name:"Embutidos",   img:"", fatherId:1}
        productoRepo.save(prod7);
    
    Producto prod8 = new Producto();
        prod8.setNombre("Salchichón ibérico artesanal");
        prod8.setDescripcion("");
        prod8.setImagen(
            "");
        prod8.setPrecio(new BigDecimal("1"));
        prod8.setCategorias(List.of(categorias.get("Ultramarinos")));
            //{   id:13,    name:"Embutidos",   img:"", fatherId:1}
        productoRepo.save(prod8);
        
        Producto prod9 = new Producto();
        prod9.setNombre("Morcilla de cebolla local");
        prod9.setDescripcion("");   
        prod9.setImagen(
            "");
        prod9.setPrecio(new BigDecimal("1"));
        prod9.setCategorias(List.of(categorias.get("Ultramarinos")));
            //{   id:13,    name:"Embutidos",   img:"", fatherId:1}
        productoRepo.save(prod9);
        
        Producto prod10 = new Producto();
        prod10.setNombre("Cervesa");
        prod10.setDescripcion("");
        prod10.setImagen(
            ""  );
        prod10.setPrecio(new BigDecimal("1"));
        prod10.setCategorias(List.of(categorias.get("Ultramarinos")));
                //{   id:14,    name:"Vinos y licores", img:"", fatherId:1},
        productoRepo.save(prod10);
        
        Producto prod11 = new Producto();
        prod11.setNombre("Licor de hierbas ");
        prod11.setDescripcion("");
        prod11.setImagen(
            ""  );
        prod11.setPrecio(new BigDecimal("1"));
        prod11.setCategorias(List.of(categorias.get("Ultramarinos")));
                //{   id:14,    name:"Vinos y licores", img:"", fatherId:1},
        productoRepo.save(prod11);
        
        Producto prod12 = new Producto();
        prod12.setNombre("Vino dulce");
        prod12.setDescripcion("");
        prod12.setImagen(
            ""  );
        prod12.setPrecio(new BigDecimal("1"));
        prod12.setCategorias(List.of(categorias.get("Ultramarinos")));
                //{   id:14,    name:"Vinos y licores", img:"", fatherId:1},
        productoRepo.save(prod12);
        
        Producto prod13 = new Producto();
        prod13.setNombre("Aceite de oliva virgen extra prensado en frío");
        prod13.setDescripcion("");
        prod13.setImagen(
            ""  );
        prod13.setPrecio(new BigDecimal("1"));
        prod13.setCategorias(List.of(categorias.get("Ultramarinos")));
                //{   id:15,    name:"Aceites y vinagres",  img:"", fatherId:1},
        productoRepo.save(prod13);
        
        Producto prod14 = new Producto();
        prod14.setNombre("Vinagre de manzana fermentado natural");
        prod14.setDescripcion("");
        prod14.setImagen(
            ""  );
        prod14.setPrecio(new BigDecimal("1"));
        prod14.setCategorias(List.of(categorias.get("Ultramarinos")));
                //{   id:15,    name:"Aceites y vinagres",  img:"", fatherId:1},
        productoRepo.save(prod14);
        
        Producto prod15 = new Producto();
        prod15.setNombre("Aceite infusionado con romero y ajo");
        prod15.setDescripcion("");
        prod15.setImagen(
            ""  );
        prod15.setPrecio(new BigDecimal("1"));
        prod15.setCategorias(List.of(categorias.get("Ultramarinos")));
                //{   id:15,    name:"Aceites y vinagres",  img:"", fatherId:1},
        productoRepo.save(prod15);
        
        Producto prod16 = new Producto();
        prod16.setNombre("Hogaza de masa madre");
        prod16.setDescripcion("");
        prod16.setImagen(
            ""  );
        prod16.setPrecio(new BigDecimal("1"));
        prod16.setCategorias(List.of(categorias.get("Ultramarinos")));
                //{   id:16,    name:"Pan / bollería",  img:"", fatherId:1},
        productoRepo.save(prod16);
        
        Producto prod17 = new Producto();
        prod17.setNombre("Pan de higo");
        prod17.setDescripcion("");
        prod17.setImagen(
            ""  );
        prod17.setPrecio(new BigDecimal("1"));
        prod17.setCategorias(List.of(categorias.get("Ultramarinos")));
                //{   id:16,    name:"Pan / bollería",  img:"", fatherId:1},
        productoRepo.save(prod17);
        
        Producto prod18 = new Producto();
        prod18.setNombre("Polvorones hechos a mano");
        prod18.setDescripcion("");
        prod18.setImagen(
            ""  );
        prod18.setPrecio(new BigDecimal("1"));
        prod18.setCategorias(List.of(categorias.get("Ultramarinos")));
                //{   id:16,    name:"Pan / bollería",  img:"", fatherId:1},
        productoRepo.save(prod18);
        
        Producto prod19 = new Producto();
        prod19.setNombre("Turrón de almendra artesanal");
        prod19.setDescripcion("");
        prod19.setImagen(
            ""  );
        prod19.setPrecio(new BigDecimal("1"));
        prod19.setCategorias(List.of(categorias.get("Ultramarinos")));
                //{   id:16,    name:"Pan / bollería",  img:"", fatherId:1},
        productoRepo.save(prod19);
        
        Producto prod20 = new Producto();
        prod20.setNombre("Cartulinas texturizadas hechas con papel reciclado");
        prod20.setDescripcion("");
        prod20.setImagen(
            ""  );
        prod20.setPrecio(new BigDecimal("1"));
        prod20.setCategorias(List.of(categorias.get("Papelerías")));
                //{   id:17,    name:"Cartulinas",  img:"", fatherId:2},
        productoRepo.save(prod20);
       
        System.out.println("Todos los Yroductos y categorías fueron cargados en la base de datos.");
        };
    }
}
