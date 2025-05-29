package com.example.springboot.controller;

import com.example.springboot.model.Vendedor;
import com.example.springboot.service.VendedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendedor")
public class VendedorController {

    @Autowired
    private VendedorService vendedorService;

    @GetMapping
    public List<Vendedor> listarVendedores() {
        return vendedorService.listarVendedores();
    }

    @PostMapping
    public ResponseEntity<Vendedor> crearVendedor(@RequestBody Vendedor vendedor) {
        return ResponseEntity.ok(vendedorService.guardarVendedor(vendedor));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendedor> obtenerVendedor(@PathVariable Long id) {
        Vendedor vendedor = vendedorService.buscarPorId(id);
        if (vendedor != null) {
            return ResponseEntity.ok(vendedor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVendedor(@PathVariable Long id) {
        vendedorService.eliminarVendedor(id);
        return ResponseEntity.noContent().build();
    }
}
