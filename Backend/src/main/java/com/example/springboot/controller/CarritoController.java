// CarritoController.java - ACTUALIZADO para manejar cantidades correctamente
package com.example.springboot.controller;

import com.example.springboot.dto.CarritoRequest;
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
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

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

            // 🔧 NUEVO: Consolidar productos y calcular cantidades
            Map<Long, Integer> productQuantities = consolidarProductos(productos);
            List<Producto> uniqueProducts = productos.stream()
                    .collect(Collectors.toMap(
                            Producto::getId,
                            p -> p,
                            (existing, replacement) -> existing))
                    .values()
                    .stream()
                    .collect(Collectors.toList());

            // Crear respuesta estructurada con cantidades
            CarritoResponseWithQuantities carritoResponse = new CarritoResponseWithQuantities();
            carritoResponse.setUserId(userInfo.getId());
            carritoResponse.setProducts(uniqueProducts);
            carritoResponse.setQuantities(productQuantities);
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

            // 🔧 MEJORADO: Agregar la cantidad especificada
            int quantity = request.getQuantity() != null ? request.getQuantity() : 1;

            for (int i = 0; i < quantity; i++) {
                carritoUniversalService.agregarProductoAlCarrito(
                        userInfo.getId(), userInfo.getRole(), request.getProductoId());
            }

            // Devolver carrito actualizado con cantidades
            return obtenerCarrito(httpRequest);
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

            // 🔧 MEJORADO: Quitar TODAS las instancias del producto
            List<Producto> productos = carritoUniversalService.obtenerProductosDelCarrito(
                    userInfo.getId(), userInfo.getRole());

            // Contar cuántas veces está el producto en el carrito
            long count = productos.stream()
                    .filter(p -> p.getId().equals(productoId))
                    .count();

            // Quitar todas las instancias
            for (int i = 0; i < count; i++) {
                carritoUniversalService.quitarProductoDelCarrito(
                        userInfo.getId(), userInfo.getRole(), productoId);
            }

            // Devolver carrito actualizado
            return obtenerCarrito(request);
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

            // 🔧 NUEVO: Lógica inteligente para actualizar cantidades
            List<Producto> productos = carritoUniversalService.obtenerProductosDelCarrito(
                    userInfo.getId(), userInfo.getRole());

            // Contar cantidad actual del producto
            long currentQuantity = productos.stream()
                    .filter(p -> p.getId().equals(request.getProductoId()))
                    .count();

            int targetQuantity = request.getQuantity();

            if (targetQuantity <= 0) {
                // Si la cantidad es 0 o negativa, quitar todas las instancias
                for (int i = 0; i < currentQuantity; i++) {
                    carritoUniversalService.quitarProductoDelCarrito(
                            userInfo.getId(), userInfo.getRole(), request.getProductoId());
                }
            } else if (targetQuantity > currentQuantity) {
                // Si la nueva cantidad es mayor, agregar la diferencia
                long difference = targetQuantity - currentQuantity;
                for (int i = 0; i < difference; i++) {
                    carritoUniversalService.agregarProductoAlCarrito(
                            userInfo.getId(), userInfo.getRole(), request.getProductoId());
                }
            } else if (targetQuantity < currentQuantity) {
                // Si la nueva cantidad es menor, quitar la diferencia
                long difference = currentQuantity - targetQuantity;
                for (int i = 0; i < difference; i++) {
                    carritoUniversalService.quitarProductoDelCarrito(
                            userInfo.getId(), userInfo.getRole(), request.getProductoId());
                }
            }
            // Si targetQuantity == currentQuantity, no hacer nada

            // Devolver carrito actualizado
            return obtenerCarrito(httpRequest);
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
            CarritoResponseWithQuantities carritoResponse = new CarritoResponseWithQuantities();
            carritoResponse.setUserId(userInfo.getId());
            carritoResponse.setProducts(Collections.emptyList());
            carritoResponse.setQuantities(new HashMap<>());
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

    // 🔧 NUEVO: Método helper para consolidar productos duplicados
    private Map<Long, Integer> consolidarProductos(List<Producto> productos) {
        Map<Long, Integer> quantities = new HashMap<>();

        for (Producto producto : productos) {
            quantities.put(producto.getId(),
                    quantities.getOrDefault(producto.getId(), 0) + 1);
        }

        return quantities;
    }

    // 🔧 NUEVA: Clase de respuesta que incluye cantidades
    public static class CarritoResponseWithQuantities {
        private Long userId;
        private List<Producto> products;
        private Map<Long, Integer> quantities;
        private String updatedAt;

        // Getters y setters
        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public List<Producto> getProducts() {
            return products;
        }

        public void setProducts(List<Producto> products) {
            this.products = products;
        }

        public Map<Long, Integer> getQuantities() {
            return quantities;
        }

        public void setQuantities(Map<Long, Integer> quantities) {
            this.quantities = quantities;
        }

        public String getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(String updatedAt) {
            this.updatedAt = updatedAt;
        }
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