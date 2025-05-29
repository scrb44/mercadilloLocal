package com.example.springboot.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Comprador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String usuario;
    private String nombre;
    private String contraseña;
    private String correo;
    private String telf;

    @ManyToMany
    @JoinTable(
            name = "carrito_comprador",  // Tabla intermedia
            joinColumns = @JoinColumn(name = "comprador_id"),
            inverseJoinColumns = @JoinColumn(name = "producto_id")
    )
    private Set<Carrito> carritos = new HashSet<>();//relacion muchos con muchos con carrito

    private List<Producto> productos;  // Relación muchos a muchos con Producto

    public Comprador(){}

    public Comprador(Long id, String usuario, String nombre, String contraseña, String correo, String telf, List<Producto> productos) {
        this.id = id;
        this.usuario = usuario;
        this.nombre = nombre;
        this.contraseña = contraseña;
        this.correo = correo;
        this.telf = telf;
        this.productos = productos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelf() {
        return telf;
    }

    public void setTelf(String telf) {
        this.telf = telf;
    }

    public List<Producto> getProductos() {
        return productos;
    }

    public void setProductos(List<Producto> productos) {
        this.productos = productos;
    }
}
