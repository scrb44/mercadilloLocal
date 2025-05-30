package com.example.springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")          // rutas que permiten CORS
                        .allowedOrigins("http://localhost:5173")  // frontend permitido
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // métodos HTTP permitidos
                        .allowCredentials(false);
            }
        };
    }
}
