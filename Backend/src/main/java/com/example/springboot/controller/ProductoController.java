package com.example.springboot.controller;

import com.example.springboot.model.Producto;
import com.example.springboot.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<Producto> obtenerProductos(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Long vendorId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q
    ) {
        return productoService.obtenerTodos().stream()
                .filter(p -> minPrice == null || p.getPrecio().compareTo(minPrice) >= 0)
                .filter(p -> maxPrice == null || p.getPrecio().compareTo(maxPrice) <= 0)
                .filter(p -> vendorId == null || (p.getVendedor() != null && p.getVendedor().getId().equals(vendorId)))
                .filter(p -> categoryId == null ||
                        (p.getCategorias() != null && p.getCategorias().stream().anyMatch(c -> c.getId().equals(categoryId))))
                .filter(p -> q == null || q.trim().isEmpty() ||
                        p.getNombre().toLowerCase().contains(q.toLowerCase()) ||
                        p.getDescripcion().toLowerCase().contains(q.toLowerCase()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        Producto producto = productoService.getProducto(id);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Producto> agregarProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoService.agregarProducto(producto);
        return ResponseEntity.ok(nuevoProducto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}
