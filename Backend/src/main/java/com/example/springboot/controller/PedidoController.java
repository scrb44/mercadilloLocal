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
import java.util.Arrays;

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

    // ✅ ROLES PERMITIDOS PARA CREAR PEDIDOS
    private static final List<String> ROLES_PERMITIDOS = Arrays.asList("COMPRADOR", "VENDEDOR", "ADMIN");

    private UserInfo obtenerInfoUsuarioDesdeToken(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new RuntimeException("Token no encontrado");
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            // ✅ VERIFICAR QUE EL ROL ES VÁLIDO PARA PEDIDOS
            if (!ROLES_PERMITIDOS.contains(role)) {
                throw new RuntimeException("Rol no autorizado para crear pedidos: " + role);
            }

            // ✅ CAMBIO: Obtener ID usando email y rol (por si acaso necesitamos el ID internamente)
            Long userId = carritoUniversalService.obtenerUsuarioIdPorEmailYTipo(email, role);

            return new UserInfo(userId, email, role);
        } catch (Exception e) {
            throw new RuntimeException("Error validando usuario: " + e.getMessage());
        }
    }

    /**
     * ✅ ACTUALIZADO: Crear pedido usando EMAIL como identificador único
     */
    @PostMapping("/crear")
    public ResponseEntity<?> crearPedido(
            @RequestBody PedidoService.CrearPedidoRequest request,
            HttpServletRequest httpRequest) {
        try {
            System.out.println("🔧 DEBUG - Iniciando creación de pedido");
            System.out.println("🔧 DEBUG - Request body: " + request);
            System.out.println("🔧 DEBUG - compradorEmail: " + request.getCompradorEmail());
            System.out.println("🔧 DEBUG - tipoComprador: " + request.getTipoComprador());

            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(httpRequest);

            System.out.println("🔧 DEBUG - Usuario del token: ID=" + userInfo.getId() +
                    ", Email=" + userInfo.getEmail() +
                    ", Role=" + userInfo.getRole());
            System.out.println("🔧 DEBUG - Usuario del request: Email=" + request.getCompradorEmail() +
                    ", Role=" + request.getTipoComprador());

            // ✅ VERIFICACIÓN POR EMAIL: Verificar que el usuario coincide con el del request
            if (!userInfo.getEmail().equals(request.getCompradorEmail())) {
                System.out.println("❌ DEBUG - Email no coincide: token=" + userInfo.getEmail() +
                        ", request=" + request.getCompradorEmail());
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("mensaje",
                                "El email del usuario no coincide. Token: " + userInfo.getEmail() +
                                        ", Request: " + request.getCompradorEmail()));
            }

            if (!userInfo.getRole().equals(request.getTipoComprador())) {
                System.out.println("❌ DEBUG - Role no coincide: token=" + userInfo.getRole() +
                        ", request=" + request.getTipoComprador());
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("mensaje",
                                "El rol del usuario no coincide. Token: " + userInfo.getRole() +
                                        ", Request: " + request.getTipoComprador()));
            }

            // ✅ VERIFICACIÓN ADICIONAL: Asegurar que el rol está permitido
            if (!ROLES_PERMITIDOS.contains(request.getTipoComprador())) {
                System.out.println("❌ DEBUG - Rol no permitido: " + request.getTipoComprador());
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("mensaje",
                                "Rol no autorizado para crear pedidos: " + request.getTipoComprador() +
                                        ". Roles permitidos: " + ROLES_PERMITIDOS));
            }

            System.out.println("✅ DEBUG - Validaciones pasadas, creando pedido...");

            // ✅ AGREGAR ID AL REQUEST PARA COMPATIBILIDAD INTERNA
            request.setCompradorId(userInfo.getId());

            // Crear el pedido
            Pedido pedido = pedidoService.crearPedidoSimulado(request);

            System.out.println("✅ DEBUG - Pedido creado exitosamente: " + pedido.getNumeroPedido());

            return ResponseEntity.ok(Collections.singletonMap("pedido", pedido));

        } catch (Exception e) {
            System.out.println("❌ DEBUG - Error creando pedido: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", "Error al crear pedido: " + e.getMessage()));
        }
    }

    /**
     * ✅ ACTUALIZADO: Obtener historial por email y rol
     */
    @GetMapping("/historial")
    public ResponseEntity<?> obtenerHistorial(HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            // ✅ CAMBIO: Buscar por email y rol en lugar de solo ID
            List<Pedido> pedidos = pedidoService.obtenerHistorialPedidosPorEmail(
                    userInfo.getEmail(), userInfo.getRole());

            return ResponseEntity.ok(Collections.singletonMap("pedidos", pedidos));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    /**
     * ✅ ACTUALIZADO: Obtener pedidos pagados por email y rol
     */
    @GetMapping("/pagados")
    public ResponseEntity<?> obtenerPedidosPagados(HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            List<Pedido> pedidos = pedidoService.obtenerPedidosPagadosPorEmail(
                    userInfo.getEmail(), userInfo.getRole());

            return ResponseEntity.ok(Collections.singletonMap("pedidos", pedidos));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    /**
     * ✅ ACTUALIZADO: Obtener pedido específico por ID (mantener para compatibilidad)
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

            // ✅ VERIFICACIÓN POR EMAIL: Verificar que el pedido pertenece al usuario autenticado
            if (!pedido.getCompradorEmail().equals(userInfo.getEmail()) ||
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
     * ✅ ACTUALIZADO: Obtener estadísticas por email y rol
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticas(HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            PedidoService.EstadisticasPedidos estadisticas =
                    pedidoService.obtenerEstadisticasPorEmail(userInfo.getEmail(), userInfo.getRole());

            return ResponseEntity.ok(Collections.singletonMap("estadisticas", estadisticas));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    /**
     * ✅ ACTUALIZADO: Obtener pedidos recientes por email y rol
     */
    @GetMapping("/recientes")
    public ResponseEntity<?> obtenerPedidosRecientes(HttpServletRequest request) {
        try {
            UserInfo userInfo = obtenerInfoUsuarioDesdeToken(request);

            List<Pedido> pedidos = pedidoService.obtenerPedidosRecientesPorEmail(
                    userInfo.getEmail(), userInfo.getRole());

            return ResponseEntity.ok(Collections.singletonMap("pedidos", pedidos));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    /**
     * ✅ ACTUALIZADO: Buscar pedido por número (verificación por email)
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

            // ✅ VERIFICACIÓN POR EMAIL: Verificar que el pedido pertenece al usuario autenticado
            if (!pedido.getCompradorEmail().equals(userInfo.getEmail()) ||
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