package com.example.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.model.Vendedor;

public interface VendedorRepository extends JpaRepository<Vendedor, Long> {
    Vendedor findByUsuarioAndPassword(String usuario, String password);
    boolean existsByUsuario(String usuario);
    Vendedor findByEmail(String email);
}
