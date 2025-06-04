package com.example.springboot.config;

import com.example.springboot.model.Categoria;
import com.example.springboot.model.Producto;
import com.example.springboot.model.Localidad;
import com.example.springboot.model.Vendedor;
import com.example.springboot.repository.CategoriaRepository;
import com.example.springboot.repository.ProductoRepository;
import com.example.springboot.repository.ProvinciaRepository;
import com.example.springboot.repository.VendedorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Configuration
public class InitVendedores {
/*
    @Bean
    CommandLineRunner initVendedoresRunner(
            VendedorRepository vendedorRepository,
            ProductoRepository productoRepository,
            ProvinciaRepository provinciaRepository,
            CategoriaRepository categoriaRepository) {

        return args -> {
            // Crear o buscar la provincia Málaga
            Localidad malaga = provinciaRepository.findByNombre("Málaga");
            if (malaga == null) {
                malaga = new Localidad();
                malaga.setNombre("Málaga");
                provinciaRepository.save(malaga);
            }

            // Vendedor Juan
            Vendedor juan = vendedorRepository.findByEmail("juan@gmail.com");
            if (juan == null) {
                juan = new Vendedor();
                juan.setNombre("Juan Pérez");
                juan.setUsuario("juan123");
                juan.setEmail("juan@gmail.com");
                juan.setPassword("123456");
                juan.setTelf("123456789");
                juan.setVerificado(true);
                juan.setProvincia(malaga);
                vendedorRepository.save(juan);
            }

            // Vendedora María
            Vendedor maria = vendedorRepository.findByEmail("maria@gmail.com");
            if (maria == null) {
                maria = new Vendedor();
                maria.setNombre("María López");
                maria.setUsuario("maria456");
                maria.setEmail("maria@gmail.com");
                maria.setPassword("123456");
                maria.setTelf("987654321");
                maria.setVerificado(false);
                maria.setProvincia(malaga);
                vendedorRepository.save(maria);
            }

            // Vendedor Carlos
            Vendedor carlos = vendedorRepository.findByEmail("carlos@gmail.com");
            if (carlos == null) {
                carlos = new Vendedor();
                carlos.setNombre("Carlos García");
                carlos.setUsuario("carlos789");
                carlos.setEmail("carlos@gmail.com");
                carlos.setPassword("123456");
                carlos.setTelf("555123456");
                carlos.setVerificado(true);
                carlos.setProvincia(malaga);
                vendedorRepository.save(carlos);
            }

            // Crear categorías si no existen
            Categoria ropa = categoriaRepository.findByNombre("Ropa");
            if (ropa == null) {
                ropa = new Categoria();
                ropa.setNombre("Ropa");
                categoriaRepository.save(ropa);
            }

            Categoria accesorios = categoriaRepository.findByNombre("Accesorios");
            if (accesorios == null) {
                accesorios = new Categoria();
                accesorios.setNombre("Accesorios");
                categoriaRepository.save(accesorios);
            }

            Categoria lujo = categoriaRepository.findByNombre("Lujo");
            if (lujo == null) {
                lujo = new Categoria();
                lujo.setNombre("Lujo");
                categoriaRepository.save(lujo);
            }

            // Añadir productos si no hay ninguno
            if (productoRepository.count() == 0) {
                Producto prod1 = new Producto(null, "Camiseta blanca", "Camiseta",
                        Arrays.asList(ropa), juan, null, "camiseta.jpg", new BigDecimal("15.99"));

                Producto prod2 = new Producto(null, "Gorra deportiva", "Gorra",
                        Arrays.asList(ropa, accesorios), juan, null, "gorra.jpg", new BigDecimal("9.99"));

                Producto prod3 = new Producto(null, "Bolso elegante", "Bolso",
                        Arrays.asList(accesorios, lujo), maria, null, "bolso.jpg", new BigDecimal("79.99"));

                Producto prod4 = new Producto(null, "Reloj clásico", "Reloj",
                        Arrays.asList(lujo), carlos, null, "reloj.jpg", new BigDecimal("129.99"));

                productoRepository.saveAll(Arrays.asList(prod1, prod2, prod3, prod4));
            }
        };
    }*/
}
