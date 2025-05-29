package com.example.springboot.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imagen;
    private String nombre;
    public Categoria(){}
    @ManyToOne
    @JoinColumn(name = "categoria_padre_id")
    private Producto categoriaPadre;  // Relación consigo misma (jerarquía de categorías)

    @OneToMany(mappedBy = "categoria")
    private List<Producto> productos;  // Relación uno a muchos con Producto

    @OneToMany(mappedBy = "categoriaPadre")
    private List<Producto> subcategorias;  // Subcategorías

    public Categoria(Long id, String imagen, String nombre, Producto categoriaPadre, List<Producto> productos, List<Producto> subcategorias) {
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

    public Producto getCategoriaPadre() {
        return categoriaPadre;
    }

    public List<Producto> getProductos() {
        return productos;
    }

    public List<Producto> getSubcategorias() {
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

    public void setCategoriaPadre(Producto categoriaPadre) {
        this.categoriaPadre = categoriaPadre;
    }

    public void setProductos(List<Producto> productos) {
        this.productos = productos;
    }

    public void setSubcategorias(List<Producto> subcategorias) {
        this.subcategorias = subcategorias;
    }
}
