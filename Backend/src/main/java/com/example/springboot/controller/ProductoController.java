package com.example.springboot.controller;

import com.example.springboot.model.Comprador;
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
                // Filtro por precio mínimo
                .filter(p -> minPrice == null || p.getPrecio().compareTo(minPrice) >= 0)
                // Filtro por precio máximo
                .filter(p -> maxPrice == null || p.getPrecio().compareTo(maxPrice) <= 0)
                // Filtro por vendedor
                .filter(p -> vendorId == null ||
                        (p.getVendedor() != null && p.getVendedor().getId().equals(vendorId)))
                // Filtro por categoría
                .filter(p -> categoryId == null ||
                        (p.getCategoria() != null && p.getCategoria().getId().equals(categoryId)))
                // Filtro por búsqueda de texto
                .filter(p -> q == null || q.trim().isEmpty() ||
                        p.getNombre().toLowerCase().contains(q.toLowerCase()) ||
                        p.getDescripcion().toLowerCase().contains(q.toLowerCase()))

                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerComprador(@PathVariable Long id) {
        Producto producto = productoService.getProducto(id);

        if (producto != null) {
            return ResponseEntity.ok(producto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /*
    @PostMapping
    public Producto agregarProducto(@RequestBody Producto producto) {
        return productoService.agregarProducto(producto);}

    @PostMapping
    public void eliminarProducto(@RequestBody Producto producto) {
        productoService.eliminarProducto(producto.getId());
    }*/

}
