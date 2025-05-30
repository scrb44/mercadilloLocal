package com.example.springboot.controller;

import com.example.springboot.dto.LoginRequest;
import com.example.springboot.dto.LoginResponse;
import com.example.springboot.dto.RegisterRequest;
import com.example.springboot.model.Admin;
import com.example.springboot.model.Comprador;
import com.example.springboot.model.Vendedor;
import com.example.springboot.repository.CompradorRepository;
import com.example.springboot.repository.VendedorRepository;
import com.example.springboot.service.AdminService;
import com.example.springboot.service.CompradorService;
import com.example.springboot.service.VendedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CompradorService compradorService;

    @Autowired
    private VendedorService vendedorService;

    @Autowired
    private VendedorRepository vendedorRepository;

    @Autowired
    private CompradorRepository compradorRepository;

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
            return ResponseEntity.ok(new LoginResponse("COMPRADOR", comprador.getUsuario(), comprador.getEmail()));
        }

        Vendedor vendedor = vendedorService.login(correo, contraseña);
        if (vendedor != null) {
            return ResponseEntity.ok(new LoginResponse("VENDEDOR", vendedor.getUsuario(), vendedor.getEmail()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }

    @GetMapping("/status")
    public ResponseEntity<?> verificarSesion(@RequestParam String usuario, @RequestParam String password) {
        if (adminService.login(usuario, password) != null) {
            return ResponseEntity.ok("Sesión iniciada como ADMIN");
        }

        if (compradorService.login(usuario, password) != null) {
            return ResponseEntity.ok("Sesión iniciada como COMPRADOR");
        }

        if (vendedorService.login(usuario, password) != null) {
            return ResponseEntity.ok("Sesión iniciada como VENDEDOR");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No hay sesión activa");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest dto) {
        try {
            if (dto.getRole().equalsIgnoreCase("comprador")) {
                Comprador comprador = new Comprador();
                comprador.setUsuario(dto.getUsuario());
                comprador.setNombre(dto.getNombre());
                comprador.setEmail(dto.getEmail());
                comprador.setPassword(dto.getPassword());
                comprador.setTelf(dto.getTelf());
                compradorRepository.save(comprador);
                System.out.println("DTO recibido: " + dto.getUsuario() + ", " + dto.getNombre());
            } else if (dto.getRole().equalsIgnoreCase("vendedor")) {
                Vendedor vendedor = new Vendedor();
                vendedor.setUsuario(dto.getUsuario());
                vendedor.setNombre(dto.getNombre());
                vendedor.setEmail(dto.getEmail());
                vendedor.setPassword(dto.getPassword());
                vendedor.setTelf(dto.getTelf());
                vendedor.setVerificado(false);
                vendedorRepository.save(vendedor);
            } else {
                return ResponseEntity.badRequest().body("Rol inválido");
            }
            return ResponseEntity.ok("Usuario creado correctamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el usuario: " + e.getMessage());
        }
    }


}
