package com.example.springboot.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtAuthFilter;

    public SecurityConfig(JwtFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Rutas de autenticación - siempre públicas
                        .requestMatchers("/api/auth/**").permitAll()

                        // Localidad - Get público
                        .requestMatchers(HttpMethod.GET, "/api/localidad/**").permitAll()

                        // Productos - GET público, POST/PUT/DELETE requieren autenticación
                        .requestMatchers(HttpMethod.GET, "/api/producto/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/producto/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/producto/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/producto/**").authenticated()

                        // Categorías - solo GET público
                        .requestMatchers(HttpMethod.GET, "/api/categoria/**").permitAll()

                        // Carrito - requiere autenticación
                        .requestMatchers("/api/carrito/**").authenticated()

                        // Todo lo demás requiere autenticación
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // 🔧 NUEVA: Configuración CORS detallada
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permitir origen del frontend
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

        // Permitir todos los métodos HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Permitir todos los headers
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Permitir credentials (para tokens)
        configuration.setAllowCredentials(true);

        // Exponer headers de autorización
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}