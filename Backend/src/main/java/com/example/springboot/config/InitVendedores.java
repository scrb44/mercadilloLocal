package com.example.springboot.config;

import com.example.springboot.model.Localidad;
import com.example.springboot.model.Vendedor;
import com.example.springboot.repository.LocalidadRepository;
import com.example.springboot.repository.VendedorRepository;
import com.example.springboot.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class InitVendedores {

    @Bean
    CommandLineRunner initVendedoresRunner(
            VendedorRepository vendedorRepository,

            LocalidadRepository provinciaRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            // Crear provincia
           Localidad malaga = new Localidad();
            malaga.setNombre("Málaga");
            malaga = provinciaRepository.save(malaga);

            // Crear vendedor
            Vendedor vendedorTasca = new Vendedor();
            vendedorTasca.setNombre("Tasca Malagueña");
            vendedorTasca.setUsuario("TascaMalaquena");
            vendedorTasca.setEmail("tascamalaga@gmail.com");
            vendedorTasca.setTelf("644545467");
            vendedorTasca.setVerificado(true);
            vendedorTasca.setPassword(passwordEncoder.encode("123456"));
            vendedorTasca.setImagen("https://ejemplo.com/tasca.jpg");
            vendedorTasca.setLocalidad(malaga);
            vendedorRepository.save(vendedorTasca);
            System.out.println("✔️ Vendedores iniciales cargados.");
        };
    }
}

