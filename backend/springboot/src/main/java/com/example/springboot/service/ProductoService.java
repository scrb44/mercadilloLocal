package com.example.springboot.service;

import com.example.springboot.model.Categoria;
import com.example.springboot.model.Producto;
import com.example.springboot.repository.CategoriaRepository;
import com.example.springboot.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Obtener productos por categoría
    public List<Producto> obtenerProductosPorCategoria(Long categoriaId) {
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
        return productoRepository.findByCategoria(categoria);
    }

    // Crear un producto
    public Producto crearProducto(Long categoriaId, Producto producto) {
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
        producto.setCategoria(categoria);
        return productoRepository.save(producto);
    }

    // Actualizar un producto
    public Producto actualizarProducto(Long productoId, Producto producto) {
        Producto productoExistente = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        productoExistente.setNombre(producto.getNombre());
        productoExistente.setPrecio(producto.getPrecio());
        productoExistente.setDescripcion(producto.getDescripcion());
        productoExistente.setImagenes(producto.getImagenes());
        return productoRepository.save(productoExistente);
    }

    // Eliminar un producto
    public void eliminarProducto(Long productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        productoRepository.delete(producto);
    }
}
