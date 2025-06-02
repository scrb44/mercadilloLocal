package com.example.springboot.dto;

public class LoginResponse {
    private Long id;
    private String rol;
    private String usuario;
    private String nombre;
    private String email;
    private String imagen;

    public LoginResponse() {
    }

    public LoginResponse(Long id, String rol, String usuario, String nombre, String email, String imagen) {
        this.id = id;
        this.rol = rol;
        this.usuario = usuario;
        this.nombre = nombre;
        this.email = email;
        this.imagen = imagen;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
}