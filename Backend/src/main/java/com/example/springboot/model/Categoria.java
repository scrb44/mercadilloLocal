package com.example.springboot.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imagen;
    private String nombre;
    public Categoria(){}
    @ManyToOne
    @JoinColumn(name = "categoria_padre_id")
    private Categoria categoriaPadre;  // Relación consigo misma (jerarquía de categorías)

    @ManyToMany(mappedBy = "categorias")
    @JsonIgnore
    private List<Producto> productos;

    @OneToMany(mappedBy = "categoriaPadre")
    private List<Categoria> subcategorias;  // Subcategorías

    public Categoria(Long id, String imagen, String nombre, Categoria categoriaPadre, List<Producto> productos, List<Categoria> subcategorias) {
        this.id = id;
        this.imagen = imagen;
        this.nombre = nombre;
        this.categoriaPadre = categoriaPadre;
        this.productos = productos;
        this.subcategorias = subcategorias;
    }

    public Long getId() {
        return id;
    }

    public String getImagen() {
        return imagen;
    }

    public String getNombre() {
        return nombre;
    }

    public Categoria getCategoriaPadre() {
        return categoriaPadre;
    }

    public List<Producto> getProductos() {
        return productos;
    }

    public List<Categoria> getSubcategorias() {
        return subcategorias;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setCategoriaPadre(Categoria categoriaPadre) {
        this.categoriaPadre = categoriaPadre;
    }

    public void setProductos(List<Producto> productos) {
        this.productos = productos;
    }

    public void setSubcategorias(List<Categoria> subcategorias) {
        this.subcategorias = subcategorias;
    }
}
