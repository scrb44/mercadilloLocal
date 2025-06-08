package com.example.springboot.controller;

import com.example.springboot.model.Pedido;
import com.example.springboot.service.PedidoService;
import com.example.springboot.service.CarritoUniversalService;
import com.example.springboot.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

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

    /**
     * Crear pedido desde el carrito (simular pago)
     */
    @PostMapping("/crear")
    public ResponseEntity<?> crearPedido(
            @RequestBody PedidoService.CrearPedidoRequest request,
            HttpServletRequest httpRequest) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(httpRequest);

            // Verificar que el usuario coincide con el del request
            if (!userInfo.getId().equals(request.getCompradorId()) ||
                    !userInfo.getRole().equals(request.getTipoComprador())) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("mensaje", "Los datos del usuario no coinciden"));
            }

            // Crear el pedido
            Pedido pedido = pedidoService.crearPedidoSimulado(request);

            return ResponseEntity.ok(Collections.singletonMap("pedido", pedido));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", "Error al crear pedido: " + e.getMessage()));
        }
    }

    /**
     * Obtener historial de pedidos del usuario autenticado
     */
    @GetMapping("/historial")
    public ResponseEntity<?> obtenerHistorial(HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            List<Pedido> pedidos = pedidoService.obtenerHistorialPedidos(
                    userInfo.getId(), userInfo.getRole());

            return ResponseEntity.ok(Collections.singletonMap("pedidos", pedidos));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    /**
     * Obtener pedidos pagados del usuario autenticado
     */
    @GetMapping("/pagados")
    public ResponseEntity<?> obtenerPedidosPagados(HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            List<Pedido> pedidos = pedidoService.obtenerPedidosPagados(
                    userInfo.getId(), userInfo.getRole());

            return ResponseEntity.ok(Collections.singletonMap("pedidos", pedidos));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    /**
     * Obtener pedido específico por ID
     */
    @GetMapping("/{pedidoId}")
    public ResponseEntity<?> obtenerPedido(
            @PathVariable Long pedidoId,
            HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            Optional<Pedido> pedidoOpt = pedidoService.obtenerPedidoPorId(pedidoId);

            if (pedidoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Pedido pedido = pedidoOpt.get();

            // Verificar que el pedido pertenece al usuario autenticado
            if (!pedido.getCompradorId().equals(userInfo.getId()) ||
                    !pedido.getTipoComprador().equals(userInfo.getRole())) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("mensaje", "No tienes permisos para ver este pedido"));
            }

            return ResponseEntity.ok(Collections.singletonMap("pedido", pedido));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    /**
     * Obtener estadísticas de pedidos del usuario
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticas(HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            PedidoService.EstadisticasPedidos estadisticas =
                    pedidoService.obtenerEstadisticas(userInfo.getId(), userInfo.getRole());

            return ResponseEntity.ok(Collections.singletonMap("estadisticas", estadisticas));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    /**
     * Obtener pedidos recientes (últimos 30 días)
     */
    @GetMapping("/recientes")
    public ResponseEntity<?> obtenerPedidosRecientes(HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            List<Pedido> pedidos = pedidoService.obtenerPedidosRecientes(
                    userInfo.getId(), userInfo.getRole());

            return ResponseEntity.ok(Collections.singletonMap("pedidos", pedidos));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    /**
     * Buscar pedido por número
     */
    @GetMapping("/buscar/{numeroPedido}")
    public ResponseEntity<?> buscarPorNumero(
            @PathVariable String numeroPedido,
            HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            Optional<Pedido> pedidoOpt = pedidoService.obtenerPedidoPorNumero(numeroPedido);

            if (pedidoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Pedido pedido = pedidoOpt.get();

            // Verificar que el pedido pertenece al usuario autenticado
            if (!pedido.getCompradorId().equals(userInfo.getId()) ||
                    !pedido.getTipoComprador().equals(userInfo.getRole())) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("mensaje", "No tienes permisos para ver este pedido"));
            }

            return ResponseEntity.ok(Collections.singletonMap("pedido", pedido));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    // Clase helper para información del usuario
    private static class UserInfo {
        private final Long id;
        private final String email;
        private final String role;

        public UserInfo(Long id, String email, String role) {
            this.id = id;
            this.email = email;
            this.role = role;
        }

        public Long getId() { return id; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}