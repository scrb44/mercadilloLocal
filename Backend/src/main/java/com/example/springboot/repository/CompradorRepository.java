package com.example.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.model.Comprador;

import java.util.Optional;


public interface CompradorRepository extends JpaRepository<Comprador, Long> {
    Comprador findByUsuarioAndPassword(String usuario, String password);
    boolean existsByUsuario(String usuario);
    Comprador findByEmail(String email);
    Comprador  findByUsuario(String usuario);


}
