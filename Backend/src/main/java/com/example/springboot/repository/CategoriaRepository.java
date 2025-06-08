package com.example.springboot.repository;

import com.example.springboot.model.Categoria;
import com.example.springboot.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Categoria findByNombre(String nombre);
    @Query("""
    SELECT DISTINCT c 
    FROM Categoria c 
    JOIN c.productos p 
    JOIN p.vendedor v 
    JOIN v.localidad l
    WHERE l.id = :localidadId 
""")
    List<Categoria> categoriasConProductosEnLocalidad(@Param("localidadId") long localidadId);
}