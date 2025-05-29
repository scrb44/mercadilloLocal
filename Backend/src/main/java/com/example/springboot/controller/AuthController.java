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
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CompradorService compradorService;

    @Autowired
    private VendedorService vendedorService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String correo = loginRequest.getEmail();
        String contraseña = loginRequest.getPassword();

        Admin admin = adminService.login(correo, contraseña);
        if (admin != null) {
            return ResponseEntity.ok(new LoginResponse("ADMIN", admin.getNombre(), admin.getEmail()));
        }

        Comprador comprador = compradorService.login(correo, contraseña);
        if (comprador != null) {
            return ResponseEntity.ok(new LoginResponse("COMPRADOR", comprador.getUsuario(), admin.getEmail()));
        }

        Vendedor vendedor = vendedorService.login(correo, contraseña);
        if (vendedor != null) {
            return ResponseEntity.ok(new LoginResponse("VENDEDOR", vendedor.getUsuario(), admin.getEmail()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }

    @GetMapping("/status")
    public ResponseEntity<?> verificarSesion(@RequestParam String usuario, @RequestParam String contraseña) {
        if (adminService.login(usuario, contraseña) != null) {
            return ResponseEntity.ok("Sesión iniciada como ADMIN");
        }

        if (compradorService.login(usuario, contraseña) != null) {
            return ResponseEntity.ok("Sesión iniciada como COMPRADOR");
        }

        if (vendedorService.login(usuario, contraseña) != null) {
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
                admin.setEmail(request.getEmail());
                admin.setPassword(request.getPassword());
                adminService.guardarAdmin(admin);
                return ResponseEntity.ok("Admin registrado");

            case "COMPRADOR":
                Comprador comprador = new Comprador();
                comprador.setUsuario(usuario);
                comprador.setNombre(request.getNombre());
                comprador.setPassword(request.getPassword());
                comprador.setEmail(request.getEmail());
                comprador.setTelf(request.getTelf());
                compradorService.guardarComprador(comprador);
                return ResponseEntity.ok("Comprador registrado");

            case "VENDEDOR":
                Vendedor vendedor = new Vendedor();
                vendedor.setUsuario(usuario);
                vendedor.setNombre(request.getNombre());
                vendedor.setPassword(request.getPassword());
                vendedor.setEmail(request.getEmail());
                vendedor.setTelf(request.getTelf());
                vendedorService.guardarVendedor(vendedor);
                return ResponseEntity.ok("Vendedor registrado");

            default:
                return ResponseEntity.badRequest().body("Rol no válido");
        }
    }


}
