package com.example.springboot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String usuario;
    @JsonIgnore
    private String password;
    private String email;
    private String imagen;

    @ManyToMany
    @JoinTable(
            name = "carrito_admin",
            joinColumns = @JoinColumn(name = "admin_id"),
            inverseJoinColumns = @JoinColumn(name = "producto_id")
    )
    @JsonIgnore
    private List<Producto> productos = new ArrayList<>();

    public Admin() {
    }

    public Admin(Long id, String nombre, String usuario, String password, String email, String imagen) {
        this.id = id;
        this.nombre = nombre;
        this.usuario = usuario;
        this.password = password;
        this.email = email;
        this.imagen = imagen;
        this.productos = new ArrayList<>(); // Inicializar carrito vacío
    }

    // Getters y Setters existentes
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    // ✅ NUEVO: Getters y Setters para carrito
    public List<Producto> getProductos() {
        return productos != null ? productos : new ArrayList<>();
    }

    public void setProductos(List<Producto> productos) {
        this.productos = productos != null ? productos : new ArrayList<>();
    }
}