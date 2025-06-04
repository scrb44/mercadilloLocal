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
                                   ProvinciaRepository provinciaRepo) {
        return args -> {
            Map<String, Categoria> categorias = new HashMap<>();

            Categoria cat1= new Categoria();
            cat1.setNombre("Ultramarinos");

            Categoria cat2= new Categoria();
            cat2.setNombre("Papelerías");

            Categoria cat3= new Categoria();
            cat3.setNombre("Discos");

            Categoria cat4= new Categoria();
            cat4.setNombre("Ropa");

            Categoria cat5= new Categoria();
            cat5.setNombre("Carpinteria");

            // Producto 1: Auriculares (Electrónica)
    // ============ PRODUCTOS MÁS VENDIDOS (primeros en el array) ========
        
        Producto prod1 = new Producto();
        prod1.setNombre("Tomate frito casero en tarro de vidrio");
        prod1.setDescripcion("");
        prod1.setImagen(
            "");
        prod1.setPrecio(new BigDecimal("1"));
        prod1.setCategoria(categorias.get("Ultramarinos"));
            //{   id:11,	name:"Conservas ",	img:"",	fatherId:1}
        ProductoRepo.save(prod1);
        
        Producto prod2 = new Producto();
        prod2.setNombre("Mermelada de frutos del bosque artesanal");
        prod2.setDescripcion("");	
        prod2.setImagen(
            "");
        prod2.setPrecio(new BigDecimal("1"));
        prod2.setCategoria(categorias.get("Ultramarinos"));
            //{   id:11,	name:"Conservas ",	img:"",	fatherId:1}
        ProductoRepo.save(prod2);
        
        Producto prod3 = new Producto();
        prod3.setNombre("Pimientos del piquillo confitados");
        prod3.setDescripcion("");	
        prod3.setImagen(
            "");
        prod3.setPrecio(new BigDecimal("1"));
        prod3.setCategoria(categorias.get("Ultramarinos"));
            //{   id:11,	name:"Conservas ",	img:"",	fatherId:1}
        ProductoRepo.save(prod3);
        
        Producto prod4 = new Producto();
        prod4.setNombre("Lentejas pardinas a granel");
        prod4.setDescripcion("");	
        prod4.setImagen(
            "");
        prod4.setPrecio(new BigDecimal("1"));
        prod4.setCategoria(categorias.get("Ultramarinos"));
            //{   id:12,	name:"Legumbres",	img:"",	fatherId:1}
        ProductoRepo.save(prod4);
        
        Producto prod5 = new Producto();
        prod5.setNombre("Garbanzos ecológicos en saco de tela");
        prod5.setDescripcion("");	
        prod5.setImagen(
            "");
        prod5.setPrecio(new BigDecimal("1"));
        prod5.setCategoria(categorias.get("Ultramarinos"));
            //{   id:12,	name:"Legumbres",	img:"",	fatherId:1}
        ProductoRepo.save(prod5);
        
        Producto prod6 = new Producto();
        prod6.setNombre("Alubias blancas seleccionadas");
        prod6.setDescripcion("");	
        prod6.setImagen(
            "");
        prod6.setPrecio(new BigDecimal("1"));
        prod6.setCategoria(categorias.get("Ultramarinos"));
            //{   id:12,	name:"Legumbres",	img:"",	fatherId:1}
        ProductoRepo.save(prod6);
        
        Producto prod7 = new Producto();
        prod7.setNombre("Chorizo curado de elaboración propia");
        prod7.setDescripcion("");	
        prod7.setImagen(
            "");
        prod7.setPrecio(new BigDecimal("1"));
        prod7.setCategoria(categorias.get("Ultramarinos"));
            //{   id:13,	name:"Embutidos",	img:"",	fatherId:1}
        ProductoRepo.save(prod7);
    
    Producto prod8 = new Producto();
        prod8.setNombre("Salchichón ibérico artesanal");
        prod8.setDescripcion("");
        prod8.setImagen(
            "");
        prod8.setPrecio(new BigDecimal("1"));
        prod8.setCategoria(categorias.get("Ultramarinos"));
            //{   id:13,	name:"Embutidos",	img:"",	fatherId:1}
        ProductoRepo.save(prod8);
        
        Producto prod9 = new Producto();
        prod9.setNombre("Morcilla de cebolla local");
        prod9.setDescripcion("");	
        prod9.setImagen(
            "");
        prod9.setPrecio(new BigDecimal("1"));
        prod9.setCategoria(categorias.get("Ultramarinos"));
            //{   id:13,	name:"Embutidos",	img:"",	fatherId:1}
        ProductoRepo.save(prod9);
        
        Producto prod10 = new Producto();
        prod10.setNombre("Cervesa");
        prod10.setDescripcion("");
        prod10.setImagen(
            ""	);
        prod10.setPrecio(new BigDecimal("1"));
        prod10.setCategoria(categorias.get("Ultramarinos"));
                //{   id:14,	name:"Vinos y licores",	img:"",	fatherId:1},
        ProductoRepo.save(prod10);
        
        Producto prod11 = new Producto();
        prod11.setNombre("Licor de hierbas ");
        prod11.setDescripcion("");
        prod11.setImagen(
            ""	);
        prod11.setPrecio(new BigDecimal("1"));
        prod11.setCategoria(categorias.get("Ultramarinos"));
                //{   id:14,	name:"Vinos y licores",	img:"",	fatherId:1},
        ProductoRepo.save(prod11);
        
        Producto prod12 = new Producto();
        prod12.setNombre("Vino dulce");
        prod12.setDescripcion("");
        prod12.setImagen(
            ""	);
        prod12.setPrecio(new BigDecimal("1"));
        prod12.setCategoria(categorias.get("Ultramarinos"));
                //{   id:14,	name:"Vinos y licores",	img:"",	fatherId:1},
        ProductoRepo.save(prod12);
        
        Producto prod13 = new Producto();
        prod13.setNombre("Aceite de oliva virgen extra prensado en frío");
        prod13.setDescripcion("");
        prod13.setImagen(
            ""	);
        prod13.setPrecio(new BigDecimal("1"));
        prod13.setCategoria(categorias.get("Ultramarinos"));
                //{   id:15,	name:"Aceites y vinagres",	img:"",	fatherId:1},
        ProductoRepo.save(prod13);
        
        Producto prod14 = new Producto();
        prod14.setNombre("Vinagre de manzana fermentado natural");
        prod14.setDescripcion("");
        prod14.setImagen(
            ""	);
        prod14.setPrecio(new BigDecimal("1"));
        prod14.setCategoria(categorias.get("Ultramarinos"));
                //{   id:15,	name:"Aceites y vinagres",	img:"",	fatherId:1},
        ProductoRepo.save(prod14);
        
        Producto prod15 = new Producto();
        prod15.setNombre("Aceite infusionado con romero y ajo");
        prod15.setDescripcion("");
        prod15.setImagen(
            ""	);
        prod15.setPrecio(new BigDecimal("1"));
        prod15.setCategoria(categorias.get("Ultramarinos"));
                //{   id:15,	name:"Aceites y vinagres",	img:"",	fatherId:1},
        ProductoRepo.save(prod15);
        
        Producto prod16 = new Producto();
        prod16.setNombre("Hogaza de masa madre");
        prod16.setDescripcion("");
        prod16.setImagen(
            ""	);
        prod16.setPrecio(new BigDecimal("1"));
        prod16.setCategoria(categorias.get("Ultramarinos"));
                //{   id:16,	name:"Pan / bollería",	img:"",	fatherId:1},
        ProductoRepo.save(prod16);
        
        Producto prod17 = new Producto();
        prod17.setNombre("Pan de higo");
        prod17.setDescripcion("");
        prod17.setImagen(
            ""	);
        prod17.setPrecio(new BigDecimal("1"));
        prod17.setCategoria(categorias.get("Ultramarinos"));
                //{   id:16,	name:"Pan / bollería",	img:"",	fatherId:1},
        ProductoRepo.save(prod17);
        
        Producto prod18 = new Producto();
        prod18.setNombre("Polvorones hechos a mano");
        prod18.setDescripcion("");
        prod18.setImagen(
            ""	);
        prod18.setPrecio(new BigDecimal("1"));
        prod18.setCategoria(categorias.get("Ultramarinos"));
                //{   id:16,	name:"Pan / bollería",	img:"",	fatherId:1},
        ProductoRepo.save(prod18);
        
        Producto prod19 = new Producto();
        prod19.setNombre("Turrón de almendra artesanal");
        prod19.setDescripcion("");
        prod19.setImagen(
            ""	);
        prod19.setPrecio(new BigDecimal("1"));
        prod19.setCategoria(categorias.get("Ultramarinos"));
                //{   id:16,	name:"Pan / bollería",	img:"",	fatherId:1},
        ProductoRepo.save(prod19);
        
        Producto prod20 = new Producto();
        prod20.setNombre("Cartulinas texturizadas hechas con papel reciclado");
        prod20.setDescripcion("");
        prod20.setImagen(
            ""	);
        prod20.setPrecio(new BigDecimal("1"));
        prod20.setCategoria(categorias.get("Papelerías"));
                //{   id:17,	name:"Cartulinas",	img:"",	fatherId:2},
        ProductoRepo.save(prod20);
        /*
        Yroducto prod = new Yroducto();
        prod.setNombre("Cartulina ");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:17,	name:"Cartulinas",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Packs de cartulina de colores artesanales");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:17,	name:"Cartulinas",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Estuche ");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:18,	name:"Útiles escolares",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Regla ");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:18,	name:"Útiles escolares",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Lapiz");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:18,	name:"Útiles escolares",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Cuaderno cosido a mano con papel reciclado");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:19,	name:"Libretas / cuadernos",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Libreta con cubierta de cuero reciclado");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:19,	name:"Libretas / cuadernos",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Diario con tapa de madera grabada");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:19,	name:"Libretas / cuadernos",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Soporte para bolígrafos de cerámica");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:20,	name:"Material de oficina",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Organizadores de escritorio de madera");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:20,	name:"Material de oficina",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Clips de papel decorativos artesanales");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:20,	name:"Material de oficina",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Carpeta de cartón reciclado encuadernada a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:21,	name:"Carpetas",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Carpeta de fieltro cosida artesanalmente");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:21,	name:"Carpetas",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Carpeta con diseño pintado a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:21,	name:"Carpetas",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Pegamento madera");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:22,	name:"Adhesivos",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Stickers ");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:22,	name:"Adhesivos",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Posits");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:22,	name:"Adhesivos",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Acuarelas ");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:23,	name:"Artículos de arte ",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Pinceles con mango de bambú");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:23,	name:"Artículos de arte ",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Lápices de colores hechos con madera reciclada");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:23,	name:"Artículos de arte ",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Tarjetas de cumpleaños pintadas a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:24,	name:"Regalos y felicitaciones",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Sobres ilustrados con tinta vegetal");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:24,	name:"Regalos y felicitaciones",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Kit para hacer velas artesanales");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:25,	name:"Manualidades",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Kit de bordado para principiantes");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:25,	name:"Manualidades",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Caja de cuentas de madera pintadas a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Papelerías"));
                //{   id:25,	name:"Manualidades",	img:"",	fatherId:2},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Álbum de banda local prensado en vinilo");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:26,	name:"Vinilos",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Edición limitada de vinilo");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:26,	name:"Vinilos",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Vinilo recopilatorio de músicos independientes");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:26,	name:"Vinilos",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Álbum acústico de artista local");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:27,	name:"CD’s",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("CD promocional con arte impreso a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:27,	name:"CD’s",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Disco con grabaciones en vivo de conciertos pequeños");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:27,	name:"CD’s",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Cassette edición limitada de música indie");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:28,	name:"Casetes",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Cassette grabado y decorado artesanalmente");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:28,	name:"Casetes",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Reedición casete de banda underground local");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:28,	name:"Casetes",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Documental de autor ");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:29,	name:"Películas",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("DVD de cine experimental independiente");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:29,	name:"Películas",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Camiseta serigrafiada por artistas locales");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:30,	name:"Merch",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Tote bag con logo de banda local");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:30,	name:"Merch",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Láminas firmadas por músicos");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:30,	name:"Merch",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Álbum digital con descarga en tarjeta física");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:31,	name:"Música",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Canción personalizada grabada por artista local");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:31,	name:"Música",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("EP acústico de producción independiente");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:31,	name:"Música",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Serie web recopilada en DVD artesanal");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:32,	name:"Series",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Merch de series locales:pines, postales");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:32,	name:"Series",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Banda sonora original en CD");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Discos"));
                //{   id:32,	name:"Series",	img:"",	fatherId:3},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Camisa marengo");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:33,	name:"Hombre",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Chaleco tejido artesanalmente");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:33,	name:"Hombre",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Cinturón de cuero trabajado a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:33,	name:"Hombre",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Falda bohemia cosida artesanalmente");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:34,	name:"Mujer",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Blusa de algodón orgánico");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:34,	name:"Mujer",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Bufanda de lana hilada a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:34,	name:"Mujer",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Camiseta de algodón organico");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:35,	name:"Niños",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Conjunto de ropa de bebé hecho a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:35,	name:"Niños",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Gorro de lana para niño/a");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:35,	name:"Niños",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Pelele de tela ecológica");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:36,	name:"Infantes",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Manta tejida a crochet");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:36,	name:"Infantes",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Babero reversible artesanal");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:36,	name:"Infantes",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Camisa de lino bordada a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:37,	name:"Camisas",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Camisa con estampado artesanal (block print)");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:37,	name:"Camisas",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Camisa reciclada upcycled");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:37,	name:"Camisas",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Pantalón ancho de algodón orgánico");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:38,	name:"Pantalones",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Pantalón reciclado con parches");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:38,	name:"Pantalones",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Bombachos de lino artesanal");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:38,	name:"Pantalones",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Alpargatas hechas a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:39,	name:"Zapatos",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Sandalias de cuero artesano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:39,	name:"Zapatos",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Zapatillas cosidas con tela reciclada");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:39,	name:"Zapatos",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Ropa interior de algodón orgánico");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:40,	name:"Interiores",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Bralette artesanal sin aros");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:40,	name:"Interiores",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Calzoncillos de tela natural");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:40,	name:"Interiores",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Cinturones de tela o cuero reciclado");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:41,	name:"Accesorios",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Gorro de lana hecho a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:41,	name:"Accesorios",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Bolsos tejidos con fibras naturales");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Ropa:"));
                //{   id:41,	name:"Accesorios",	img:"",	fatherId:4},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Marco de fotos tallado a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:42,	name:"Marcos",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Marco con barniz ecológico");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:42,	name:"Marcos",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Marco decorativo de madera reciclada");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:42,	name:"Marcos",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Puerta de roble artesanal");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:43,	name:"Puertas",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Puerta rústica con herrajes forjados");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:43,	name:"Puertas",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Puerta corrediza tipo granero");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:43,	name:"Puertas",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Tabla de olivo");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:44,	name:"Maderas",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Tablas de pino");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:44,	name:"Maderas",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("madera maciza");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:44,	name:"Maderas",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Mesa de comedor hecha a mano");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:45,	name:"Mueblería",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Estantería modular artesanal");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:45,	name:"Mueblería",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Silla de diseño con madera local");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:45,	name:"Mueblería",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Lámpara colgante de madera torneada");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:46,	name:"Decoración en madera",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Reloj de pared rústico");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:46,	name:"Decoración en madera",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Letras decorativas talladas");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:46,	name:"Decoración en madera",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Organizadores de escritorio de madera");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:46,	name:"Decoración en madera",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
        
        Yroducto prod = new Yroducto();
        prod.setNombre("Diario con tapa de madera grabada");
        prod.setDescripcion("");
        prod.setImagen(
            ""	);
        prod.setPrecio(new BigDecimal("1"));
        prod.setCategoria(categorias.get(name:"Carpinteria:"));
                //{   id:46,	name:"Decoración en madera",	img:"",	fatherId:5},
        YroductoRepo.save(prod);
*/
        System.out.println("Todos los Yroductos y categorías fueron cargados en la base de datos.");
        };
    }
}
