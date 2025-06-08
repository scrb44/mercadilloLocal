// CarritoController.java - SIMPLIFICADO usando el método universal
package com.example.springboot.controller;

import com.example.springboot.dto.CarritoRequest;
import com.example.springboot.dto.CarritoResponse;
import com.example.springboot.dto.UpdateQuantityRequest;
import com.example.springboot.model.Producto;
import com.example.springboot.service.CarritoUniversalService;
import com.example.springboot.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    @Autowired
    private CarritoUniversalService carritoUniversalService;

    @Autowired
    private JwtUtil jwtUtil;

    private UserInfo obtenerInfoUsuarioDesdeToken(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new RuntimeException("Token no encontrado");
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            Long userId = carritoUniversalService.obtenerUsuarioIdPorEmailYTipo(email, role);

            return new UserInfo(userId, email, role);
        } catch (Exception e) {
            throw new RuntimeException("Error validando usuario: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> obtenerCarrito(HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            List<Producto> productos = carritoUniversalService.obtenerProductosDelCarrito(
                    userInfo.getId(), userInfo.getRole());

            // Crear respuesta estructurada
            CarritoResponse carritoResponse = new CarritoResponse();
            carritoResponse.setUserId(userInfo.getId());
            carritoResponse.setProducts(productos != null ? productos : Collections.emptyList());
            carritoResponse.setUpdatedAt(java.time.LocalDateTime.now().toString());

            return ResponseEntity.ok(carritoResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> agregarAlCarrito(
            @RequestBody CarritoRequest request,
            HttpServletRequest httpRequest) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(httpRequest);

            // Agregar producto al carrito usando servicio universal
            carritoUniversalService.agregarProductoAlCarrito(
                    userInfo.getId(), userInfo.getRole(), request.getProductoId());

            // Devolver carrito actualizado
            List<Producto> productos = carritoUniversalService.obtenerProductosDelCarrito(
                    userInfo.getId(), userInfo.getRole());

            CarritoResponse carritoResponse = new CarritoResponse();
            carritoResponse.setUserId(userInfo.getId());
            carritoResponse.setProducts(productos);
            carritoResponse.setUpdatedAt(java.time.LocalDateTime.now().toString());

            return ResponseEntity.ok(carritoResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    @DeleteMapping("/remove/{productoId}")
    public ResponseEntity<?> quitarProductoDelCarrito(
            @PathVariable Long productoId,
            HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            carritoUniversalService.quitarProductoDelCarrito(
                    userInfo.getId(), userInfo.getRole(), productoId);

            // Devolver carrito actualizado
            List<Producto> productos = carritoUniversalService.obtenerProductosDelCarrito(
                    userInfo.getId(), userInfo.getRole());

            CarritoResponse carritoResponse = new CarritoResponse();
            carritoResponse.setUserId(userInfo.getId());
            carritoResponse.setProducts(productos);
            carritoResponse.setUpdatedAt(java.time.LocalDateTime.now().toString());

            return ResponseEntity.ok(carritoResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> actualizarCantidad(
            @RequestBody UpdateQuantityRequest request,
            HttpServletRequest httpRequest) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(httpRequest);

            // Simular actualización removiendo y volviendo a agregar
            carritoUniversalService.quitarProductoDelCarrito(
                    userInfo.getId(), userInfo.getRole(), request.getProductoId());

            // Agregar la nueva cantidad
            for (int i = 0; i < request.getQuantity(); i++) {
                carritoUniversalService.agregarProductoAlCarrito(
                        userInfo.getId(), userInfo.getRole(), request.getProductoId());
            }

            // Devolver carrito actualizado
            List<Producto> productos = carritoUniversalService.obtenerProductosDelCarrito(
                    userInfo.getId(), userInfo.getRole());

            CarritoResponse carritoResponse = new CarritoResponse();
            carritoResponse.setUserId(userInfo.getId());
            carritoResponse.setProducts(productos);
            carritoResponse.setUpdatedAt(java.time.LocalDateTime.now().toString());

            return ResponseEntity.ok(carritoResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<?> limpiarCarrito(HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            carritoUniversalService.limpiarCarrito(userInfo.getId(), userInfo.getRole());

            // Devolver carrito vacío
            CarritoResponse carritoResponse = new CarritoResponse();
            carritoResponse.setUserId(userInfo.getId());
            carritoResponse.setProducts(Collections.emptyList());
            carritoResponse.setUpdatedAt(java.time.LocalDateTime.now().toString());

            return ResponseEntity.ok(carritoResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> obtenerCarritoPorEmail(@PathVariable String email) {
        return ResponseEntity.badRequest()
                .body(Collections.singletonMap("mensaje",
                        "Endpoint obsoleto. Usa GET /api/carrito con autenticación JWT"));
    }

    private static class UserInfo {
        private final Long id;
        private final String email;
        private final String role;

        public UserInfo(Long id, String email, String role) {
            this.id = id;
            this.email = email;
            this.role = role;
        }

        public Long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }
    }
}