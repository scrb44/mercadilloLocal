package com.example.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.model.Comprador;

public interface CompradorRepository extends JpaRepository<Comprador, Long> {
    Comprador findByUsuarioAndContraseña(String usuario, String contraseña);
}
