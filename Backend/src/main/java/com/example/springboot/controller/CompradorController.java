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

    @PostMapping("/{usuario}/carrito")
    public String agregarProductoAlCarrito(
            @PathVariable String usuario,
            @RequestBody Long idProducto) { // Recibimos ID producto en body
        compradorService.agregarProductoAlCarrito(usuario, idProducto);
        return "Producto agregado al carrito correctamente";
    }

    @GetMapping("/{usuario}/carrito")
    public List<Producto> obtenerProductosDelCarrito(@PathVariable String usuario) {
        Comprador comprador = compradorRepository.findByUsuario(usuario);
        if (comprador == null) {
            throw new RuntimeException("Comprador no encontrado");
        }
        return comprador.getProductos();
    }


    
}
