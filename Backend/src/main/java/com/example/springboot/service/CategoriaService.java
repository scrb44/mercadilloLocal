
package com.example.springboot.service;

import com.example.springboot.model.Categoria;
import com.example.springboot.model.Producto;
import com.example.springboot.repository.CategoriaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private final CategoriaRepositorio categoriaRepo;

    public CategoriaService(CategoriaRepositorio categoriaRepo) {
        this.categoriaRepo = categoriaRepo;
    }

    public List<Categoria> obtenerTodos() {
        return categoriaRepo.findAll();}
    public Categoria agregarCategoria(Categoria categoria) {
        return categoriaRepo.save(categoria);}
    public void eliminarCategoria(Long id) {
        categoriaRepo.deleteById(id);}
}
