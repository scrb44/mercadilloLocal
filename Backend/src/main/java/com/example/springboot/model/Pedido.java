package com.example.springboot.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroPedido; // Número único del pedido (ej: ORD-2025-001)

    @Column(nullable = false)
    private LocalDateTime fechaPedido;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(nullable = false)
    private String tipoComprador; // "COMPRADOR", "VENDEDOR", "ADMIN"

    @Column(nullable = false)
    private Long compradorId; // ID del usuario que hizo la compra

    private String compradorNombre; // Nombre del comprador
    private String compradorEmail; // Email del comprador

    // Información de entrega
    private String direccionEntrega;
    private String ciudadEntrega;
    private String codigoPostalEntrega;
    private String telefonoEntrega;

    @Column(nullable = false)
    private Integer cantidadProductos; // Total de productos comprados

    // Información de los productos comprados (JSON simplificado)
    @Column(columnDefinition = "TEXT")
    private String productosJson; // JSON con info de productos: [{"id":1,"nombre":"...","precio":10.5,"cantidad":2}]

    @Column(nullable = false)
    private String estadoPago; // "PAGADO", "PENDIENTE", "FALLIDO"

    // Constructores
    public Pedido() {
        this.fechaPedido = LocalDateTime.now();
        this.estadoPago = "PAGADO"; // Por defecto pagado (simulación)
    }

    public Pedido(String numeroPedido, BigDecimal total, String tipoComprador,
                  Long compradorId, String compradorNombre, String compradorEmail,
                  Integer cantidadProductos, String productosJson) {
        this();
        this.numeroPedido = numeroPedido;
        this.total = total;
        this.tipoComprador = tipoComprador;
        this.compradorId = compradorId;
        this.compradorNombre = compradorNombre;
        this.compradorEmail = compradorEmail;
        this.cantidadProductos = cantidadProductos;
        this.productosJson = productosJson;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroPedido() { return numeroPedido; }
    public void setNumeroPedido(String numeroPedido) { this.numeroPedido = numeroPedido; }

    public LocalDateTime getFechaPedido() { return fechaPedido; }
    public void setFechaPedido(LocalDateTime fechaPedido) { this.fechaPedido = fechaPedido; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getTipoComprador() { return tipoComprador; }
    public void setTipoComprador(String tipoComprador) { this.tipoComprador = tipoComprador; }

    public Long getCompradorId() { return compradorId; }
    public void setCompradorId(Long compradorId) { this.compradorId = compradorId; }

    public String getCompradorNombre() { return compradorNombre; }
    public void setCompradorNombre(String compradorNombre) { this.compradorNombre = compradorNombre; }

    public String getCompradorEmail() { return compradorEmail; }
    public void setCompradorEmail(String compradorEmail) { this.compradorEmail = compradorEmail; }

    public String getDireccionEntrega() { return direccionEntrega; }
    public void setDireccionEntrega(String direccionEntrega) { this.direccionEntrega = direccionEntrega; }

    public String getCiudadEntrega() { return ciudadEntrega; }
    public void setCiudadEntrega(String ciudadEntrega) { this.ciudadEntrega = ciudadEntrega; }

    public String getCodigoPostalEntrega() { return codigoPostalEntrega; }
    public void setCodigoPostalEntrega(String codigoPostalEntrega) { this.codigoPostalEntrega = codigoPostalEntrega; }

    public String getTelefonoEntrega() { return telefonoEntrega; }
    public void setTelefonoEntrega(String telefonoEntrega) { this.telefonoEntrega = telefonoEntrega; }

    public Integer getCantidadProductos() { return cantidadProductos; }
    public void setCantidadProductos(Integer cantidadProductos) { this.cantidadProductos = cantidadProductos; }

    public String getProductosJson() { return productosJson; }
    public void setProductosJson(String productosJson) { this.productosJson = productosJson; }

    public String getEstadoPago() { return estadoPago; }
    public void setEstadoPago(String estadoPago) { this.estadoPago = estadoPago; }

    // Métodos helper
    public boolean estaPagado() {
        return "PAGADO".equals(this.estadoPago);
    }

    public void marcarComoPagado() {
        this.estadoPago = "PAGADO";
    }

    public void marcarComoPendiente() {
        this.estadoPago = "PENDIENTE";
    }

    public void marcarComoFallido() {
        this.estadoPago = "FALLIDO";
    }
}