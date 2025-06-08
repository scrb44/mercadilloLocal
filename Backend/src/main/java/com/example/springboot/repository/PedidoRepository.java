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

    // Buscar pedidos por comprador (cualquier tipo de usuario)
    List<Pedido> findByCompradorIdAndTipoCompradorOrderByFechaPedidoDesc(Long compradorId, String tipoComprador);

    // Buscar pedidos por email del comprador
    List<Pedido> findByCompradorEmailOrderByFechaPedidoDesc(String email);

    // Buscar por número de pedido
    Optional<Pedido> findByNumeroPedido(String numeroPedido);

    // Buscar pedidos por estado de pago
    List<Pedido> findByEstadoPagoOrderByFechaPedidoDesc(String estadoPago);

    // Buscar pedidos pagados de un usuario
    List<Pedido> findByCompradorIdAndTipoCompradorAndEstadoPagoOrderByFechaPedidoDesc(
            Long compradorId, String tipoComprador, String estadoPago);

    // Buscar pedidos recientes de un usuario (últimos X días)
    @Query("SELECT p FROM Pedido p WHERE p.compradorId = :compradorId AND p.tipoComprador = :tipoComprador " +
            "AND p.fechaPedido >= :fechaLimite ORDER BY p.fechaPedido DESC")
    List<Pedido> findPedidosRecientes(@Param("compradorId") Long compradorId,
                                      @Param("tipoComprador") String tipoComprador,
                                      @Param("fechaLimite") LocalDateTime fechaLimite);

    // Contar pedidos de un usuario
    Long countByCompradorIdAndTipoComprador(Long compradorId, String tipoComprador);

    // Contar pedidos pagados de un usuario
    Long countByCompradorIdAndTipoCompradorAndEstadoPago(Long compradorId, String tipoComprador, String estadoPago);

    // Calcular total gastado por un usuario
    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.compradorId = :compradorId " +
            "AND p.tipoComprador = :tipoComprador AND p.estadoPago = 'PAGADO'")
    BigDecimal calcularTotalGastado(@Param("compradorId") Long compradorId,
                                    @Param("tipoComprador") String tipoComprador);

    // Verificar si existe un pedido con un número específico (para generar números únicos)
    boolean existsByNumeroPedido(String numeroPedido);

    // Buscar todos los pedidos (para admin) ordenados por fecha
    List<Pedido> findAllByOrderByFechaPedidoDesc();

    // Buscar pedidos por rango de fechas
    @Query("SELECT p FROM Pedido p WHERE p.fechaPedido BETWEEN :fechaInicio AND :fechaFin ORDER BY p.fechaPedido DESC")
    List<Pedido> findByFechaPedidoBetween(@Param("fechaInicio") LocalDateTime fechaInicio,
                                          @Param("fechaFin") LocalDateTime fechaFin);
}