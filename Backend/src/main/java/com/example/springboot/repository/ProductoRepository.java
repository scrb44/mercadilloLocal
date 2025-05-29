
package com.example.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    Producto findByNombre(String nombre);

}
