package com.example.springboot.controller;

import com.example.springboot.dto.LoginRequest;
import com.example.springboot.dto.LoginResponse;
import com.example.springboot.dto.RegisterRequest;
import com.example.springboot.model.Admin;
import com.example.springboot.model.Comprador;
import com.example.springboot.model.Vendedor;
import com.example.springboot.repository.CompradorRepository;
import com.example.springboot.repository.VendedorRepository;
import com.example.springboot.security.JwtUtil;
import com.example.springboot.service.AdminService;
import com.example.springboot.service.CompradorService;
import com.example.springboot.service.VendedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

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

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String correo = loginRequest.getEmail();
        String contraseña = loginRequest.getPassword();

        String imagenPorDefecto = "https://media.istockphoto.com/id/1495088043/es/vector/icono-de-perfil-de-usuario-avatar-o-icono-de-persona-foto-de-perfil-s%C3%ADmbolo-de-retrato.jpg?s=612x612&w=0&k=20&c=mY3gnj2lU7khgLhV6dQBNqomEGj3ayWH-xtpYuCXrzk=";

        Admin admin = adminService.login(correo, contraseña);
        if (admin != null) {
            String token = jwtUtil.generateToken(admin.getEmail(), "ADMIN");
            String imagen = (admin.getImagen() == null || admin.getImagen().isEmpty()) ? imagenPorDefecto : admin.getImagen();
            return ResponseEntity.ok(new LoginResponse(
                    admin.getId(),
                    "ADMIN",
                    admin.getUsuario(),
                    admin.getNombre(),
                    admin.getEmail(),
                    imagen,
                   token
            ));
        }

        Comprador comprador = compradorService.login(correo, contraseña);
        if (comprador != null) {
            String token = jwtUtil.generateToken(comprador.getEmail(), "COMPRADOR");
            String imagen = (comprador.getImagen() == null || comprador.getImagen().isEmpty()) ? imagenPorDefecto : comprador.getImagen();
            return ResponseEntity.ok(new LoginResponse(
                    comprador.getId(),
                    "COMPRADOR",
                    comprador.getUsuario(),
                    comprador.getNombre(),
                    comprador.getEmail(),
                    imagen,
                    token
            ));
        }

        Vendedor vendedor = vendedorService.login(correo, contraseña);
        if (vendedor != null) {
            String token = jwtUtil.generateToken(vendedor.getEmail(), "VENDEDOR");
            String imagen = (vendedor.getImagen() == null || vendedor.getImagen().isEmpty()) ? imagenPorDefecto : vendedor.getImagen();
            return ResponseEntity.ok(new LoginResponse(
                    vendedor.getId(),
                    "VENDEDOR",
                    vendedor.getUsuario(),
                    vendedor.getNombre(),
                    vendedor.getEmail(),
                    imagen,
                    token
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("mensaje", "Credenciales inválidas"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest dto) {
        try {
            System.out.println("Registrando usuario: " + dto.getUsuario() + ", email: " + dto.getEmail() + ", rol: " + dto.getRole());

            if (dto.getRole().equalsIgnoreCase("comprador")) {
                Comprador comprador = new Comprador();
                comprador.setUsuario(dto.getUsuario());
                comprador.setNombre(dto.getNombre());
                comprador.setEmail(dto.getEmail());
                comprador.setPassword(passwordEncoder.encode(dto.getPassword()));
                comprador.setTelf(dto.getTelf());
                compradorRepository.save(comprador);
            } else if (dto.getRole().equalsIgnoreCase("vendedor")) {
                Vendedor vendedor = new Vendedor();
                vendedor.setUsuario(dto.getUsuario());
                vendedor.setNombre(dto.getNombre());
                vendedor.setEmail(dto.getEmail());
                vendedor.setPassword(passwordEncoder.encode(dto.getPassword()));
                vendedor.setTelf(dto.getTelf());
                vendedor.setVerificado(false);
                vendedorRepository.save(vendedor);
            } else {
                return ResponseEntity.badRequest().body("Rol inválido");
            }
            return ResponseEntity.ok("Usuario creado correctamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar el usuario: " + e.getMessage());
        }
    }


}