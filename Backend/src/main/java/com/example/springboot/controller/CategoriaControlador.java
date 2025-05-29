package com.example.springboot.controller;

import com.example.springboot.model.Categoria;
import com.example.springboot.model.Producto;
import com.example.springboot.service.CategoriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Categoria")
@CrossOrigin(origins = "*")
public class CategoriaControlador{

private final CategoriaService categoriaService;

    public CategoriaControlador(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public List<Categoria> obtenerCagorias() {
        return categoriaService.obtenerTodos();
    }

    @PostMapping
    public Categoria agregarCategoria(@RequestBody Categoria categoria) {
        return categoriaService.agregarCategoria(categoria);}

    @GetMapping("/Categoria/{id}")
    public void eliminarCategoriaPorid(long id) {
        categoriaService.eliminarCategoriaPorId(id);
    }
}
