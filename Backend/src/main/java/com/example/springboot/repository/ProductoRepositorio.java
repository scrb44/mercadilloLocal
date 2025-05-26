
package com.example.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.model.Producto;

public interface ProductoRepositorio extends JpaRepository<Producto, Long> {}
