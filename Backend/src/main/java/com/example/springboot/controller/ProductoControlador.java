// ProductoControlador.java
package com.example.springboot.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.model.Producto;
import com.example.springboot.repository.ProductoRepositorio;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")  
public class ProductoControlador {

    private final ProductoRepositorio productoRepositorio;

    public ProductoControlador(ProductoRepositorio productoRepositorio) {
        this.productoRepositorio = productoRepositorio;
    }

    @GetMapping
    public List<Producto> obtenerProductos() {
        return productoRepositorio.findAll();
    }
}
