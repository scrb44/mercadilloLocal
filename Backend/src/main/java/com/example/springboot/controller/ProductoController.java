package com.example.springboot.controller;

import com.example.springboot.model.Comprador;
import com.example.springboot.model.Producto;
import com.example.springboot.service.ProductoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<Producto> obtenerProductos() {
        return productoService.obtenerTodos();
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
