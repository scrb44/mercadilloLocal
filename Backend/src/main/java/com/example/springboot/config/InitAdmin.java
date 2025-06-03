package com.example.springboot.config;

import com.example.springboot.model.Admin;
import com.example.springboot.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class InitAdmin {

    @Bean
    CommandLineRunner initAdminRunner(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (adminRepository.findByEmail("dori@gmail.com") == null) {
                Admin dori = new Admin();
                dori.setNombre("Doriana");
                dori.setUsuario("dori");
                dori.setEmail("dori@gmail.com");
                dori.setPassword(passwordEncoder.encode("123456"));
                adminRepository.save(dori);
            }
            if (adminRepository.findByEmail("sofia@gmail.com") == null) {
                Admin sofia = new Admin();
                sofia.setNombre("Sofía");
                sofia.setUsuario("sofia");
                sofia.setEmail("sofia@gmail.com");
                sofia.setPassword(passwordEncoder.encode("123456"));
                adminRepository.save(sofia);
            }
            if (adminRepository.findByEmail("santiago@gmail.com") == null) {
                Admin santiago = new Admin();
                santiago.setNombre("Santiago");
                santiago.setUsuario("santiago");
                santiago.setEmail("santiago@gmail.com");
                santiago.setPassword(passwordEncoder.encode("123456"));
                adminRepository.save(santiago);
            }
        };
    }
}