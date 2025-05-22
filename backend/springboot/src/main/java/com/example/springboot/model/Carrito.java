package com.example.springboot.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Carrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;

    @Id
    private Long idProd;

    private String nombreProducto;

    public Carrito(Long idUser, Long idProd, String nombreProducto) {
        this.idUser = idUser;
        this.idProd = idProd;
        this.nombreProducto = nombreProducto;
    }

    public Long getIdUser() {
        return idUser;
    }

    public Long getIdProd() {
        return idProd;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public void setIdProd(Long idProd) {
        this.idProd = idProd;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }
}
