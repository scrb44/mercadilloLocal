package com.example.springboot.config;

import com.example.springboot.model.Comprador;
import com.example.springboot.model.Producto;
import com.example.springboot.repository.CompradorRepository;
import com.example.springboot.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class InitCompradores {

    @Bean
    CommandLineRunner initCompradoresRunner(CompradorRepository compradorRepository, ProductoRepository productoRepository) {
        return args -> {
            if (compradorRepository.findByEmail("ana@mail.com") == null) {
                Comprador ana = new Comprador();
                ana.setNombre("Ana Torres");
                ana.setUsuario("ana123");
                ana.setEmail("ana@mail.com");
                ana.setPassword("123456");
                ana.setTelf("111222333");

                // Buscar productos para agregar al carrito
                Producto prod1 = productoRepository.findByNombre("Camiseta Verde");
                Producto prod2 = productoRepository.findByNombre("Pantalón Azul");

                if (prod1 != null && prod2 != null) {
                    // Agregar productos al carrito del comprador
                    ana.setProductos(Arrays.asList(prod1, prod2));
                }

                compradorRepository.save(ana);
            }

            if (compradorRepository.findByEmail("lucas@mail.com") == null) {
                Comprador lucas = new Comprador();
                lucas.setNombre("Lucas Díaz");
                lucas.setUsuario("lucas456");
                lucas.setEmail("lucas@mail.com");
                lucas.setPassword("123456");
                lucas.setTelf("444555666");

                Producto prod3 = productoRepository.findByNombre("Gorra Negra");

                if (prod3 != null) {
                    lucas.setProductos(Arrays.asList(prod3));
                }

                compradorRepository.save(lucas);
            }
        };
    }
}
