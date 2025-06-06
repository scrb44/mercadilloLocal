package com.example.springboot.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Localidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String provincia;

    @OneToMany(mappedBy = "localidad")
    private List<Vendedor> vendedores;

    public Localidad(){}

    public Localidad(Long id, String nombre, String provincia) {
        this.id = id;
        this.nombre = nombre;
        this.provincia = provincia;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }
}
