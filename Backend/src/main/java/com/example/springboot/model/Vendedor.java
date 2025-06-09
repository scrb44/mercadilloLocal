package com.example.springboot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Vendedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String usuario;
    private String nombre;
    @JsonIgnore
    private String password;
    @Column(unique = true)
    private String email;
    private String telf;
    private Boolean verificado;
    private String imagen;

    @ManyToOne
    private Localidad localidad;

    @OneToMany(mappedBy = "vendedor")
    @JsonIgnore
    private List<Producto> productos;

    @ManyToMany
    @JoinTable(
            name = "carrito_vendedor",
            joinColumns = @JoinColumn(name = "vendedor_id"),
            inverseJoinColumns = @JoinColumn(name = "producto_id")
    )
    @JsonIgnore
    private List<Producto> carrito = new ArrayList<>();

    public Vendedor(){}

    public Vendedor(Long id, String usuario, String nombre, String password, String email, String telf, Boolean verificado, String imagen, Localidad localidad, List<Producto> productos) {
        this.id = id;
        this.usuario = usuario;
        this.nombre = nombre;
        this.password = password;
        this.email = email;
        this.telf = telf;
        this.verificado = verificado;
        this.imagen = imagen;
        this.localidad = localidad;
        this.productos = productos;
        this.carrito = new ArrayList<>();
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

    public String getTelf() { return telf; }
    public void setTelf(String telf) { this.telf = telf; }

    public Boolean getVerificado() { return verificado; }
    public void setVerificado(Boolean verificado) { this.verificado = verificado; }

    public List<Producto> getProductos() { return productos; } // Productos que vende
    public void setProductos(List<Producto> productos) { this.productos = productos; }

    public Localidad getLocalidad() { return localidad; }
    public void setLocalidad(Localidad localidad) { this.localidad = localidad; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public List<Producto> getCarrito() {
        return carrito != null ? carrito : new ArrayList<>();
    }

    public void setCarrito(List<Producto> carrito) {
        this.carrito = carrito != null ? carrito : new ArrayList<>();
    }
}