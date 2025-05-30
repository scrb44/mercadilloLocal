package com.example.springboot.repository;

import com.example.springboot.model.Categoria;
import com.example.springboot.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Categoria findByNombre(String nombre);
}