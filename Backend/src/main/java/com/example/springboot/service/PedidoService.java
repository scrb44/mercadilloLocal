package com.example.springboot.service;

import com.example.springboot.model.Pedido;
import com.example.springboot.repository.PedidoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private CarritoUniversalService carritoUniversalService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Crear un pedido simulando pago exitoso
     */
    @Transactional
    public Pedido crearPedidoSimulado(CrearPedidoRequest request) {
        try {
            // Crear el pedido
            Pedido pedido = new Pedido();
            pedido.setNumeroPedido(generarNumeroPedido());
            pedido.setTotal(request.getTotal());
            pedido.setTipoComprador(request.getTipoComprador());
            pedido.setCompradorId(request.getCompradorId());
            pedido.setCompradorNombre(request.getCompradorNombre());
            pedido.setCompradorEmail(request.getCompradorEmail());
            pedido.setCantidadProductos(request.getCantidadProductos());
            pedido.setDireccionEntrega(request.getDireccionEntrega());
            pedido.setCiudadEntrega(request.getCiudadEntrega());
            pedido.setCodigoPostalEntrega(request.getCodigoPostalEntrega());
            pedido.setTelefonoEntrega(request.getTelefonoEntrega());

            // Convertir productos a JSON
            String productosJson = objectMapper.writeValueAsString(request.getProductos());
            pedido.setProductosJson(productosJson);

            // Marcar como pagado (simulación)
            pedido.marcarComoPagado();

            // Guardar el pedido
            Pedido pedidoGuardado = pedidoRepository.save(pedido);

            // Limpiar el carrito después del pago exitoso
            carritoUniversalService.limpiarCarrito(
                    request.getCompradorId(),
                    request.getTipoComprador());

            return pedidoGuardado;

        } catch (Exception e) {
            throw new RuntimeException("Error al crear pedido: " + e.getMessage());
        }
    }

    /**
     * Obtener historial de pedidos de un usuario
     */
    public List<Pedido> obtenerHistorialPedidos(Long usuarioId, String tipoUsuario) {
        return pedidoRepository.findByCompradorIdAndTipoCompradorOrderByFechaPedidoDesc(
                usuarioId, tipoUsuario);
    }

    /**
     * Obtener solo pedidos pagados de un usuario
     */
    public List<Pedido> obtenerPedidosPagados(Long usuarioId, String tipoUsuario) {
        return pedidoRepository.findByCompradorIdAndTipoCompradorAndEstadoPagoOrderByFechaPedidoDesc(
                usuarioId, tipoUsuario, "PAGADO");
    }

    /**
     * Obtener pedido por ID
     */
    public Optional<Pedido> obtenerPedidoPorId(Long pedidoId) {
        return pedidoRepository.findById(pedidoId);
    }

    /**
     * Obtener pedido por número
     */
    public Optional<Pedido> obtenerPedidoPorNumero(String numeroPedido) {
        return pedidoRepository.findByNumeroPedido(numeroPedido);
    }

    /**
     * Obtener estadísticas básicas de pedidos de un usuario
     */
    public EstadisticasPedidos obtenerEstadisticas(Long usuarioId, String tipoUsuario) {
        Long totalPedidos = pedidoRepository.countByCompradorIdAndTipoComprador(usuarioId, tipoUsuario);
        Long pedidosPagados = pedidoRepository.countByCompradorIdAndTipoCompradorAndEstadoPago(
                usuarioId, tipoUsuario, "PAGADO");
        BigDecimal totalGastado = pedidoRepository.calcularTotalGastado(usuarioId, tipoUsuario);

        return new EstadisticasPedidos(
                totalPedidos.intValue(),
                pedidosPagados.intValue(),
                totalGastado);
    }

    /**
     * Obtener pedidos recientes (últimos 30 días)
     */
    public List<Pedido> obtenerPedidosRecientes(Long usuarioId, String tipoUsuario) {
        LocalDateTime hace30Dias = LocalDateTime.now().minusDays(30);
        return pedidoRepository.findPedidosRecientes(usuarioId, tipoUsuario, hace30Dias);
    }

    // ============ MÉTODOS HELPER ============

    /**
     * Generar número único de pedido
     */
    private String generarNumeroPedido() {
        String base = "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-";
        String numero;
        int contador = 1;

        do {
            numero = base + String.format("%03d", contador);
            contador++;
        } while (pedidoRepository.existsByNumeroPedido(numero));

        return numero;
    }

    // ============ CLASES DTO ============

    public static class CrearPedidoRequest {
        private BigDecimal total;
        private String tipoComprador;
        private Long compradorId;
        private String compradorNombre;
        private String compradorEmail;
        private Integer cantidadProductos;
        private String direccionEntrega;
        private String ciudadEntrega;
        private String codigoPostalEntrega;
        private String telefonoEntrega;
        private List<ProductoPedido> productos;

        // Getters y Setters
        public BigDecimal getTotal() {
            return total;
        }

        public void setTotal(BigDecimal total) {
            this.total = total;
        }

        public String getTipoComprador() {
            return tipoComprador;
        }

        public void setTipoComprador(String tipoComprador) {
            this.tipoComprador = tipoComprador;
        }

        public Long getCompradorId() {
            return compradorId;
        }

        public void setCompradorId(Long compradorId) {
            this.compradorId = compradorId;
        }

        public String getCompradorNombre() {
            return compradorNombre;
        }

        public void setCompradorNombre(String compradorNombre) {
            this.compradorNombre = compradorNombre;
        }

        public String getCompradorEmail() {
            return compradorEmail;
        }

        public void setCompradorEmail(String compradorEmail) {
            this.compradorEmail = compradorEmail;
        }

        public Integer getCantidadProductos() {
            return cantidadProductos;
        }

        public void setCantidadProductos(Integer cantidadProductos) {
            this.cantidadProductos = cantidadProductos;
        }

        public String getDireccionEntrega() {
            return direccionEntrega;
        }

        public void setDireccionEntrega(String direccionEntrega) {
            this.direccionEntrega = direccionEntrega;
        }

        public String getCiudadEntrega() {
            return ciudadEntrega;
        }

        public void setCiudadEntrega(String ciudadEntrega) {
            this.ciudadEntrega = ciudadEntrega;
        }

        public String getCodigoPostalEntrega() {
            return codigoPostalEntrega;
        }

        public void setCodigoPostalEntrega(String codigoPostalEntrega) {
            this.codigoPostalEntrega = codigoPostalEntrega;
        }

        public String getTelefonoEntrega() {
            return telefonoEntrega;
        }

        public void setTelefonoEntrega(String telefonoEntrega) {
            this.telefonoEntrega = telefonoEntrega;
        }

        public List<ProductoPedido> getProductos() {
            return productos;
        }

        public void setProductos(List<ProductoPedido> productos) {
            this.productos = productos;
        }
    }

    public static class ProductoPedido {
        private Long id;
        private String nombre;
        private BigDecimal precio;
        private Integer cantidad;
        private String imagen;

        // Constructores
        public ProductoPedido() {
        }

        public ProductoPedido(Long id, String nombre, BigDecimal precio, Integer cantidad, String imagen) {
            this.id = id;
            this.nombre = nombre;
            this.precio = precio;
            this.cantidad = cantidad;
            this.imagen = imagen;
        }

        // Getters y Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public BigDecimal getPrecio() {
            return precio;
        }

        public void setPrecio(BigDecimal precio) {
            this.precio = precio;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }

        public String getImagen() {
            return imagen;
        }

        public void setImagen(String imagen) {
            this.imagen = imagen;
        }
    }

    public static class EstadisticasPedidos {
        private final int totalPedidos;
        private final int pedidosPagados;
        private final BigDecimal totalGastado;

        public EstadisticasPedidos(int totalPedidos, int pedidosPagados, BigDecimal totalGastado) {
            this.totalPedidos = totalPedidos;
            this.pedidosPagados = pedidosPagados;
            this.totalGastado = totalGastado != null ? totalGastado : BigDecimal.ZERO;
        }

        public int getTotalPedidos() {
            return totalPedidos;
        }

        public int getPedidosPagados() {
            return pedidosPagados;
        }

        public BigDecimal getTotalGastado() {
            return totalGastado;
        }
    }
}