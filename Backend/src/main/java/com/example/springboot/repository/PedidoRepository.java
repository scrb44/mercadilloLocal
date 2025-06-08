package com.example.springboot.repository;

import com.example.springboot.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // ============ MÉTODOS ORIGINALES (mantener compatibilidad) ============

    List<Pedido> findByCompradorIdAndTipoCompradorOrderByFechaPedidoDesc(Long compradorId, String tipoComprador);

    List<Pedido> findByCompradorIdAndTipoCompradorAndEstadoPagoOrderByFechaPedidoDesc(
            Long compradorId, String tipoComprador, String estadoPago);

    Long countByCompradorIdAndTipoComprador(Long compradorId, String tipoComprador);

    Long countByCompradorIdAndTipoCompradorAndEstadoPago(Long compradorId, String tipoComprador, String estadoPago);

    Optional<Pedido> findByNumeroPedido(String numeroPedido);

    boolean existsByNumeroPedido(String numeroPedido);

    @Query("SELECT SUM(p.total) FROM Pedido p WHERE p.compradorId = :compradorId AND p.tipoComprador = :tipoComprador AND p.estadoPago = 'PAGADO'")
    BigDecimal calcularTotalGastado(@Param("compradorId") Long compradorId, @Param("tipoComprador") String tipoComprador);

    @Query("SELECT p FROM Pedido p WHERE p.compradorId = :compradorId AND p.tipoComprador = :tipoComprador AND p.fechaPedido >= :fechaLimite ORDER BY p.fechaPedido DESC")
    List<Pedido> findPedidosRecientes(@Param("compradorId") Long compradorId,
                                      @Param("tipoComprador") String tipoComprador,
                                      @Param("fechaLimite") LocalDateTime fechaLimite);

    // ============ NUEVOS MÉTODOS USANDO EMAIL COMO IDENTIFICADOR ============

    /**
     * ✅ NUEVO: Buscar pedidos por email y tipo de comprador
     */
    List<Pedido> findByCompradorEmailAndTipoCompradorOrderByFechaPedidoDesc(String compradorEmail, String tipoComprador);

    /**
     * ✅ NUEVO: Buscar pedidos pagados por email y tipo de comprador
     */
    List<Pedido> findByCompradorEmailAndTipoCompradorAndEstadoPagoOrderByFechaPedidoDesc(
            String compradorEmail, String tipoComprador, String estadoPago);

    /**
     * ✅ NUEVO: Contar pedidos por email y tipo de comprador
     */
    Long countByCompradorEmailAndTipoComprador(String compradorEmail, String tipoComprador);

    /**
     * ✅ NUEVO: Contar pedidos pagados por email y tipo de comprador
     */
    Long countByCompradorEmailAndTipoCompradorAndEstadoPago(String compradorEmail, String tipoComprador, String estadoPago);

    /**
     * ✅ NUEVO: Calcular total gastado por email y tipo de comprador
     */
    @Query("SELECT SUM(p.total) FROM Pedido p WHERE p.compradorEmail = :compradorEmail AND p.tipoComprador = :tipoComprador AND p.estadoPago = 'PAGADO'")
    BigDecimal calcularTotalGastadoPorEmail(@Param("compradorEmail") String compradorEmail, @Param("tipoComprador") String tipoComprador);

    /**
     * ✅ NUEVO: Buscar pedidos recientes por email y tipo de comprador
     */
    @Query("SELECT p FROM Pedido p WHERE p.compradorEmail = :compradorEmail AND p.tipoComprador = :tipoComprador AND p.fechaPedido >= :fechaLimite ORDER BY p.fechaPedido DESC")
    List<Pedido> findPedidosRecientesPorEmail(@Param("compradorEmail") String compradorEmail,
                                              @Param("tipoComprador") String tipoComprador,
                                              @Param("fechaLimite") LocalDateTime fechaLimite);

    /**
     * ✅ NUEVO: Buscar pedido por email y número (para mayor seguridad)
     */
    @Query("SELECT p FROM Pedido p WHERE p.numeroPedido = :numeroPedido AND p.compradorEmail = :compradorEmail AND p.tipoComprador = :tipoComprador")
    Optional<Pedido> findByNumeroPedidoAndCompradorEmailAndTipoComprador(
            @Param("numeroPedido") String numeroPedido,
            @Param("compradorEmail") String compradorEmail,
            @Param("tipoComprador") String tipoComprador);
}