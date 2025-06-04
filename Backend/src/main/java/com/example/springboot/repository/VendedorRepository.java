package com.example.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.model.Vendedor;

import java.util.List;
import java.util.Optional;

public interface VendedorRepository extends JpaRepository<Vendedor, Long> {
    Vendedor findByUsuarioAndPassword(String usuario, String password);
    boolean existsByUsuario(String usuario);
    Vendedor findByEmail(String email);
     Vendedor findByUsuario(String usuario);
}
