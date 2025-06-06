package com.example.springboot.controller;

import com.example.springboot.model.Comprador;
import com.example.springboot.model.Producto;
import com.example.springboot.repository.CompradorRepository;
import com.example.springboot.service.CompradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comprador")
public class CompradorController {

    @Autowired
    private CompradorService compradorService;

    @Autowired
    private CompradorRepository compradorRepository;

    @GetMapping
    public List<Comprador> listarCompradores() {
        return compradorService.listarCompradores();
    }

    @PostMapping
    public ResponseEntity<Comprador> crearComprador(@RequestBody Comprador comprador) {
        return ResponseEntity.ok(compradorService.guardarComprador(comprador));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comprador> obtenerComprador(@PathVariable Long id) {
        Comprador comprador = compradorService.buscarPorId(id);
        if (comprador != null) {
            return ResponseEntity.ok(comprador);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarComprador(@PathVariable Long id) {
        compradorService.eliminarComprador(id);
        return ResponseEntity.noContent().build();
    }

    
}
