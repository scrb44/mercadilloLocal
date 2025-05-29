package com.example.springboot.dto;

public class LoginResponse {
    private String rol;
    private String usuario;
    private String email;

    public LoginResponse() {
    }

    public LoginResponse(String rol, String usuario, String email) {
        this.rol = rol;
        this.usuario = usuario;
        this.email = email;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}