package com.example.springboot.dto;

public class LoginResponse {
    private String rol;
    private String usuario;
    private String email;
    private String token;

    public LoginResponse() {
    }

    public LoginResponse(String rol, String usuario, String email, String token) {
        this.rol = rol;
        this.usuario = usuario;
        this.email = email;
        this.token = token;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}