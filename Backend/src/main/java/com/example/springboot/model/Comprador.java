package com.example.springboot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Comprador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String usuario;
    private String nombre;
    @JsonIgnore // 👈 Esto oculta la contraseña del JSON
    private String password;
    @Column(unique = true)  // <-- aquí la restricción única
    private String email;
    private String telf;
    private String imagen;


    @ManyToMany
    @JoinTable(
            name = "comprador_producto",
            joinColumns = @JoinColumn(name = "comprador_id"),
            inverseJoinColumns = @JoinColumn(name = "producto_id")
    )
    private List<Producto> productos;


    public Comprador(){}

    public Comprador(Long id, String usuario, String nombre, String password, String email, String telf, String imagen, List<Producto> productos) {
        this.id = id;
        this.usuario = usuario;
        this.nombre = nombre;
        this.password = password;
        this.email = email;
        this.telf = telf;
        this.imagen = imagen;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
}