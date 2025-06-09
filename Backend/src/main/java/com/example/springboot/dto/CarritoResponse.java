package com.example.springboot.dto;

import com.example.springboot.model.Producto;
import java.util.List;

public class CarritoResponse {
    private Long userId;
    private List<Producto> products;
    private String updatedAt;

    public CarritoResponse() {}

    public CarritoResponse(Long userId, List<Producto> products, String updatedAt) {
        this.userId = userId;
        this.products = products;
        this.updatedAt = updatedAt;
    }

    // Getters y Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<Producto> getProducts() { return products; }
    public void setProducts(List<Producto> products) { this.products = products; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}