package com.example.springboot.controller;

import com.example.springboot.dto.CarritoRequest;
import com.example.springboot.model.Comprador;
import com.example.springboot.model.Producto;
import com.example.springboot.service.CompradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    @Autowired
    private CompradorService compradorService;

    @GetMapping("/{email}")
    public ResponseEntity<List<Producto>> obtenerCarrito(@PathVariable String email) {
        List<Producto> productos = compradorService.obtenerProductosDelCarritoPorEmail(email);
        if (productos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(productos);
    }

    @PostMapping("/agregar")
    public ResponseEntity<?> agregarAlCarrito(@RequestBody CarritoRequest request) {
        try {
            compradorService.agregarProductoAlCarrito(request.getCompradorId(), request.getProductoId());
            return ResponseEntity.ok("Producto agregado al carrito");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/quitar")
    public ResponseEntity<?> quitarProductoDelCarrito(@RequestBody CarritoRequest request) {
        try {
            compradorService.quitarProductoDelCarrito(request.getCompradorId(), request.getProductoId());
            return ResponseEntity.ok("Producto quitado del carrito");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
