package com.example.springboot.controller;

import com.example.springboot.dto.LoginRequest;
import com.example.springboot.dto.LoginResponse;
import com.example.springboot.dto.RegisterRequest;
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


    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegisterRequest request) {
        String usuario = request.getUsuario();

        // Verificar si el usuario ya existe en cualquiera de las tablas
        boolean existeUsuario = compradorService.existePorUsuario(usuario) ||
                vendedorService.existePorUsuario(usuario) ||
                adminService.existePorUsuario(usuario);

        if (existeUsuario) {
            return ResponseEntity.badRequest().body("Error: El nombre de usuario ya está en uso.");
        }

        switch (request.getRol().toUpperCase()) {
            case "ADMIN":
                Admin admin = new Admin();
                admin.setUsuario(usuario);
                admin.setNombre(request.getNombre());
                admin.setContraseña(request.getContraseña());
                adminService.guardarAdmin(admin);
                return ResponseEntity.ok("Admin registrado");

            case "COMPRADOR":
                Comprador comprador = new Comprador();
                comprador.setUsuario(usuario);
                comprador.setNombre(request.getNombre());
                comprador.setContraseña(request.getContraseña());
                comprador.setCorreo(request.getCorreo());
                comprador.setTelf(request.getTelf());
                compradorService.guardarComprador(comprador);
                return ResponseEntity.ok("Comprador registrado");

            case "VENDEDOR":
                Vendedor vendedor = new Vendedor();
                vendedor.setUsuario(usuario);
                vendedor.setNombre(request.getNombre());
                vendedor.setContraseña(request.getContraseña());
                vendedor.setCorreo(request.getCorreo());
                vendedor.setTelf(request.getTelf());
                vendedorService.guardarVendedor(vendedor);
                return ResponseEntity.ok("Vendedor registrado");

            default:
                return ResponseEntity.badRequest().body("Rol no válido");
        }
    }


}
