package com.example.springboot.controller;

import com.example.springboot.dto.LoginRequest;
import com.example.springboot.dto.LoginResponse;
import com.example.springboot.model.Admin;
import com.example.springboot.model.Comprador;
import com.example.springboot.model.Vendedor;
import com.example.springboot.service.AdminService;
import com.example.springboot.service.CompradorService;
import com.example.springboot.service.VendedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String usuario = loginRequest.getUsuario();
        String contraseña = loginRequest.getContraseña();

        Admin admin = adminService.login(usuario, contraseña);
        if (admin != null) {
            return ResponseEntity.ok(new LoginResponse("ADMIN", admin.getNombre()));
        }

        Comprador comprador = compradorService.login(usuario, contraseña);
        if (comprador != null) {
            return ResponseEntity.ok(new LoginResponse("COMPRADOR", comprador.getUsuario()));
        }

        Vendedor vendedor = vendedorService.login(usuario, contraseña);
        if (vendedor != null) {
            return ResponseEntity.ok(new LoginResponse("VENDEDOR", vendedor.getUsuario()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }

    @GetMapping("/status")
    public ResponseEntity<?> verificarSesion(
            @RequestParam String usuario,
            @RequestParam String contraseña
    ) {
        Admin admin = adminService.login(usuario, contraseña);
        if (admin != null) {
            return ResponseEntity.ok("Sesión iniciada como ADMIN");
        }

        Comprador comprador = compradorService.login(usuario, contraseña);
        if (comprador != null) {
            return ResponseEntity.ok("Sesión iniciada como COMPRADOR");
        }

        Vendedor vendedor = vendedorService.login(usuario, contraseña);
        if (vendedor != null) {
            return ResponseEntity.ok("Sesión iniciada como VENDEDOR");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No hay sesión activa");
    }


}
