package com.example.springboot.service;

import com.example.springboot.model.Producto;
import com.example.springboot.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private final ProductoRepository productoRepo;

    public ProductoService(ProductoRepository productoRepo) {
        this.productoRepo = productoRepo;
    }

    public List<Producto> obtenerTodos() {
        return productoRepo.findAll();
    }

    public Producto getProducto(Long id) {
        return productoRepo.getReferenceById(id);
    }

    public Producto agregarProducto(Producto producto) {
        return productoRepo.save(producto);
    }
    public void eliminarProducto(Long id) {
        productoRepo.deleteById(id);
    }
}
