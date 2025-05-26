package com.example.springboot.controller;

import com.example.springboot.model.Categoria;
import com.example.springboot.service.CategoriaService;


import java.util.List;


private final CategoriaService categoriaService;

    public CategoriaControlador(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public List<Categoria> obtenerProductos() {
        return CategoriaService.obtenerTodos();
    }

    @PostMapping
    public CategoriaControlador agregarCategoria() {return CategoriaService.agregarCategoria();}

    @PostMapping
    public CategoriaControlador eliminarCategoria() {
        return CategoriaService.eliminarCategoria();
    }
}
