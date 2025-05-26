
package com.example.springboot.service;

import com.example.springboot.model.Categoria;
import com.example.springboot.repository.CategoriaRepositorio;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepositorio categoriaRepo;

    public CategoriaService(CategoriaRepositorio categoriaRepo) {
        this.categoriaRepo = categoriaRepo;
    }

    public List<Categoria> obtenerTodas() {
        return categoriaRepo.findAll();
    }
}
