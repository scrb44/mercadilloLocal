package com.example.springboot.model;


import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion;
    private BigDecimal precio;
    private String nombre;
    private String imagen;
/*
    @JsonIgnore
    @ManyToMany(mappedBy = "productos")
    private List<Comprador> compradores;  // Relación muchos a muchos con Comprador
*/
    //@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;  // Relación muchos a uno con Categoria
/*
    //@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "vendedor_id")
    private Vendedor vendedor;  // Relación muchos a uno con Vendedor
*/
    public Producto(){}

    public Producto(Long id, String descripcion, String nombre, String imagen, BigDecimal precio) {// Categoria categoria, Vendedor vendedor, List<Comprador> compradores,
        this.id = id;
        this.descripcion = descripcion;
        this.nombre = nombre;
        //this.categoria = categoria;
        //this.vendedor = vendedor;
        //this.compradores = compradores;
        this.imagen = imagen;
        this.precio = precio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
/*
    public Vendedor getVendedor() {
        return vendedor;
    }

    public void setVendedor(Vendedor vendedor) {
        this.vendedor = vendedor;
    }

    public List<Comprador> getCompradores() {
        return compradores;
    }

    public void setCompradores(List<Comprador> compradores) {
        this.compradores = compradores;
    }
*/
    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }
}
