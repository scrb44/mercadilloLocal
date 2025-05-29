package com.example.springboot.service;

import com.example.springboot.model.Producto;
import com.example.springboot.repository.ProductoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private final ProductoRepositorio productoRepo;

    public ProductoService(ProductoRepositorio productoRepo) {
        this.productoRepo = productoRepo;
    }

    public List<Producto> obtenerTodos() {return productoRepo.findAll();}
    public Producto agregarProducto(Producto producto) {
        return productoRepo.save(producto);}
    /*public void eliminarProducto(Long id) {
        productoRepo.deleteById(id);
    }*/
}
