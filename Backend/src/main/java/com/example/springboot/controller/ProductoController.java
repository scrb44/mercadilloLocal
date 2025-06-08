package com.example.springboot.controller;

import com.example.springboot.model.Producto;
import com.example.springboot.service.ProductoService;
import com.example.springboot.security.JwtUtil;
import com.example.springboot.service.VendedorService;
import com.example.springboot.model.Vendedor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ProductoController {

    private final ProductoService productoService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private VendedorService vendedorService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<Producto> obtenerProductos(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Long vendedor,
            @RequestParam(required = false) Long categoria,
            @RequestParam(required = false) String busqueda
    ) {
        return productoService.obtenerTodos().stream()
                .filter(p -> minPrice == null || p.getPrecio().compareTo(minPrice) >= 0)
                .filter(p -> maxPrice == null || p.getPrecio().compareTo(maxPrice) <= 0)
                .filter(p -> vendedor == null || (p.getVendedor() != null && p.getVendedor().getId().equals(vendedor)))
                .filter(p -> categoria == null ||
                        (p.getCategorias() != null && p.getCategorias().stream().anyMatch(c -> c.getId().equals(categoria))))
                .filter(p -> busqueda == null || busqueda.trim().isEmpty() ||
                        p.getNombre().toLowerCase().contains(busqueda.toLowerCase()) ||
                        p.getDescripcion().toLowerCase().contains(busqueda.toLowerCase()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        try {
            Producto producto = productoService.getProducto(id);
            if (producto != null) {
                return ResponseEntity.ok(producto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Producto> agregarProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoService.agregarProducto(producto);
        return ResponseEntity.ok(nuevoProducto);
    }

    // 🔧 MÉTODO PUT CORREGIDO
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProducto(
            @PathVariable Long id,
            @RequestBody Producto producto,
            HttpServletRequest request) {

        try {
            // Verificar token de autorización
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("mensaje", "Token requerido"));
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            System.out.println("🔧 Usuario del token: " + email + ", Rol: " + role);

            if (!"VENDEDOR".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Collections.singletonMap("mensaje", "Solo vendedores pueden actualizar productos"));
            }

            // Verificar que el producto existe
            Producto productoExistente = productoService.getProducto(id);
            if (productoExistente == null) {
                return ResponseEntity.notFound().build();
            }

            // Verificar que el producto pertenece al vendedor
            if (productoExistente.getVendedor() == null ||
                    !email.equals(productoExistente.getVendedor().getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Collections.singletonMap("mensaje", "No tienes permisos para actualizar este producto"));
            }

            // Actualizar solo los campos permitidos, manteniendo el vendedor original
            productoExistente.setNombre(producto.getNombre());
            productoExistente.setDescripcion(producto.getDescripcion());
            productoExistente.setPrecio(producto.getPrecio());
            productoExistente.setImagen(producto.getImagen());

            // Actualizar categorías si se proporcionan
            if (producto.getCategorias() != null) {
                productoExistente.setCategorias(producto.getCategorias());
            }

            // Guardar producto actualizado
            Producto productoActualizado = productoService.actualizarProducto(productoExistente);

            return ResponseEntity.ok(productoActualizado);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("mensaje", "Error interno del servidor: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}