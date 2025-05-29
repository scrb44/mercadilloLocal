package com.example.springboot.dto;

public class LoginResponse {
    private String rol;
    private String usuario;

    public LoginResponse() {
    }

    public LoginResponse(String rol, String usuario) {
        this.rol = rol;
        this.usuario = usuario;
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
}
