package com.example.springboot.repository;

import com.example.springboot.model.Localidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocalidadRepository extends JpaRepository<Localidad, Long>{
    Localidad findByNombre(String nombre);
    @Query("""
    SELECT l FROM Localidad l
    WHERE EXISTS (
        SELECT v FROM Vendedor v
        WHERE v.localidad = l
    )
""")
    List<Localidad>  findconvendedores();
}
