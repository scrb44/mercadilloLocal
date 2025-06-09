package com.example.springboot.dto;

public class CarritoRequest {
    private Long productoId;
    private Integer quantity;

    public CarritoRequest() {
    }

    public CarritoRequest(Long productoId, Integer quantity) {
        this.productoId = productoId;
        this.quantity = quantity;
    }

    // Getters y Setters
    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}