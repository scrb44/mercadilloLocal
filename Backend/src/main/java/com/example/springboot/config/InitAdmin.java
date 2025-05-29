package com.example.springboot.config;

import com.example.springboot.model.Admin;
import com.example.springboot.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

public class InitAdmin {

    @Bean
    CommandLineRunner initAdmin(AdminRepository adminRepository) {
        return args -> {
            if (adminRepository.findByEmail("dori@gmail.com") == null) {
                Admin admin = new Admin();
                admin.setNombre("Doriana");
                admin.setUsuario("dori");
                admin.setEmail("dori@gmail.com");
                admin.setPassword("1234");
                adminRepository.save(admin);
            }
        };
    }

}
