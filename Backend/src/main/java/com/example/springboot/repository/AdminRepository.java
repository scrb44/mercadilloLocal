package com.example.springboot.repository;

import com.example.springboot.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Admin findByNombreAndEmail(String nombre, String password);
    Admin findByEmail(String email);
    boolean existsByUsuario(String usuario);

}
