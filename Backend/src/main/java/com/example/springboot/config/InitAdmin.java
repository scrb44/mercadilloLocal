package com.example.springboot.config;

import com.example.springboot.model.Admin;
import com.example.springboot.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InitAdmin {

    @Bean
    CommandLineRunner initAdminRunner(AdminRepository adminRepository) {
        return args -> {
            if (adminRepository.findByEmail("dori@gmail.com") == null) {
                Admin admin = new Admin();
                admin.setNombre("Doriana");
                admin.setUsuario("dori");
                admin.setEmail("dori@gmail.com");
                admin.setPassword("123456");
                adminRepository.save(admin);
            }
            if (adminRepository.findByEmail("sofia@gmail.com") == null) {
                Admin sofia = new Admin();
                sofia.setNombre("Sofía");
                sofia.setUsuario("sofia");
                sofia.setEmail("sofia@gmail.com");
                sofia.setPassword("123456");
                adminRepository.save(sofia);
            }
            if (adminRepository.findByEmail("santiago@gmail.com") == null) {
                Admin santiago = new Admin();
                santiago.setNombre("Santiago");
                santiago.setUsuario("santiago");
                santiago.setEmail("santiago@gmail.com");
                santiago.setPassword("123456");
                adminRepository.save(santiago);
            }
        };
    }
}