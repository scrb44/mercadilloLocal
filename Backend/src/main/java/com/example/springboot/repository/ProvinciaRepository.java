package com.example.springboot.repository;

import com.example.springboot.model.Comprador;
import com.example.springboot.model.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProvinciaRepository extends JpaRepository<Provincia, Long>{
    Provincia findByNombre(String nombre);
}
