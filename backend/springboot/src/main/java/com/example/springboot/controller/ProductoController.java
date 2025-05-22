package com.example.springboot.controller;

import com.example.springboot.model.Producto;
import com.example.springboot.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // Obtener todos los productos de una categoría
    @GetMapping("/categorias/{categoriaId}")
    public ResponseEntity<List<Producto>> obtenerProductosPorCategoria(@PathVariable Long categoriaId) {
        List<Producto> productos = productoService.obtenerProductosPorCategoria(categoriaId);
        return ResponseEntity.ok(productos);
    }

    // Agregar un producto a una categoría
    @PostMapping("/categorias/{categoriaId}")
    public ResponseEntity<Producto> crearProducto(@PathVariable Long categoriaId, @RequestBody Producto producto) {
        Producto nuevoProducto = productoService.crearProducto(categoriaId, producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }

    // Actualizar un producto
    @PutMapping("/{productoId}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long productoId, @RequestBody Producto producto) {
        Producto productoActualizado = productoService.actualizarProducto(productoId, producto);
        return ResponseEntity.ok(productoActualizado);
    }

    // Eliminar un producto
    @DeleteMapping("/{productoId}")
    public ResponseEntity<Map<String, String>> eliminarProducto(@PathVariable Long productoId) {
        productoService.eliminarProducto(productoId);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Producto eliminado con éxito.");
        return ResponseEntity.ok(response);
    }
}
