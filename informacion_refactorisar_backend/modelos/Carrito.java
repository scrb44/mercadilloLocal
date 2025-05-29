package com.example.springboot.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Carrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;

    // @Id; nesesidad de refactorisar many to many para poder soportar una unique key de multiples valores
    private Long idProd;

    private String nombreProducto;

    @ManyToMany(mappedBy = "carritos")
    private Set<Comprador> carrito_comprador= new HashSet<>();

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
