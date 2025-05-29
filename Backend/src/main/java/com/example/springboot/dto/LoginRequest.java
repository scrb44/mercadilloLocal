package com.example.springboot.dto;

public class LoginRequest {
    private String usuario;
    private String password;
    private String email;

    public LoginRequest() {
    }

    public LoginRequest(String usuario, String password, String email) {
        this.usuario = usuario;
        this.password = password;
        this.email = email;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
