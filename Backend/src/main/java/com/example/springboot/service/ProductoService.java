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
        try {
            return productoRepo.findById(id).orElse(null);
        } catch (Exception e) {
            System.out.println("❌ Error obteniendo producto " + id + ": " + e.getMessage());
            return null;
        }
    }

    public Producto agregarProducto(Producto producto) {
        return productoRepo.save(producto);
    }

    // 🔧 MÉTODO ACTUALIZAR PRODUCTO
    public Producto actualizarProducto(Producto producto) {
        try {
            // Verificar que el producto existe
            if (!productoRepo.existsById(producto.getId())) {
                throw new RuntimeException("Producto no encontrado con ID: " + producto.getId());
            }

            Producto productoGuardado = productoRepo.save(producto);
            return productoGuardado;
        } catch (Exception e) {
            throw e;
        }
    }

    public void eliminarProducto(Long id) {
        productoRepo.deleteById(id);
    }
}