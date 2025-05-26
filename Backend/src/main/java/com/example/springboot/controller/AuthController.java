package com.example.springboot.controller;

import com.example.springboot.model.Admin;
import com.example.springboot.model.Comprador;
import com.example.springboot.model.Vendedor;
import com.example.springboot.service.AdminService;
import com.example.springboot.service.CompradorService;
import com.example.springboot.service.VendedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CompradorService compradorService;

    @Autowired
    private VendedorService vendedorService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> login) {
        String usuario = login.get("usuario");
        String contraseña = login.get("contraseña");

        Admin admin = adminService.login(usuario, contraseña);
        if (admin != null) {
            return ResponseEntity.ok(Map.of("rol", "ADMIN", "usuario", admin.getNombre()));
        }

        Comprador comprador = compradorService.login(usuario, contraseña);
        if (comprador != null) {
            return ResponseEntity.ok(Map.of("rol", "COMPRADOR", "usuario", comprador.getUsuario()));
        }

        Vendedor vendedor = vendedorService.login(usuario, contraseña);
        if (vendedor != null) {
            return ResponseEntity.ok(Map.of("rol", "VENDEDOR", "usuario", vendedor.getUsuario()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }
}
