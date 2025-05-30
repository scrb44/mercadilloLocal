package com.example.springboot.dto;

public class RegisterRequest {

    private String usuario;
    private String nombre;
    private String email;
    private String password;
    private String telf;
    private String role;


    public RegisterRequest(String usuario, String nombre, String email, String password, String telf, String role) {
        this.usuario = usuario;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.telf = telf;
        this.role = role;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTelf() {
        return telf;
    }

    public void setTelf(String telf) {
        this.telf = telf;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}