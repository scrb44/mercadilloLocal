package com.example.springboot.service;

import com.example.springboot.model.Categoria;
import com.example.springboot.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private final CategoriaRepository categoriaRepo;

    public CategoriaService(CategoriaRepository categoriaRepo) {
        this.categoriaRepo = categoriaRepo;
    }

    public List<Categoria> obtenerTodos() {
        return categoriaRepo.findAll();
    }

    public Categoria buscarPorId(Long id) {
        return categoriaRepo.getReferenceById(id);
    }

    public Categoria agregarCategoria(Categoria categoria) {
        return categoriaRepo.save(categoria);
    }

    public void eliminarCategoria(Long id) {
        categoriaRepo.deleteById(id);
    }
    public List<Categoria> unir(){return categoriaRepo.joincategoriasproductos();}
    public List<Categoria> categoriasConProductos(long localidadId) {
        return categoriaRepo.categoriasConProductosEnLocalidad(localidadId);
    }
}