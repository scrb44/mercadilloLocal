package com.example.springboot.repository;

import com.example.springboot.model.Localidad;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProvinciaRepository extends JpaRepository<Localidad, Long>{
    Localidad findByNombre(String nombre);
}
