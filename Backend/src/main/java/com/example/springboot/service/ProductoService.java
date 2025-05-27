package com.example.springboot.service;

import com.example.springboot.model.Producto;
import com.example.springboot.repository.ProductoRepositorio;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepositorio productoRepo;

    public ProductoService(ProductoRepositorio productoRepo) {
        this.productoRepo = productoRepo;
    }

    public List<Producto> obtenerTodos() {
        return productoRepo.findAll();
    }
}
