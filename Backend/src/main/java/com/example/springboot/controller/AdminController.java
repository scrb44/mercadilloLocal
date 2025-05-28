package com.example.springboot.controller;

import com.example.springboot.model.Admin;
import com.example.springboot.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    public List<Admin> listarAdmins() {
        return adminService.listarAdmins();
    }

    @PostMapping
    public ResponseEntity<Admin> crearAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.guardarAdmin(admin));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> obtenerAdmin(@PathVariable Long id) {
        Admin admin = adminService.buscarPorId(id);
        if (admin != null) {
            return ResponseEntity.ok(admin);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAdmin(@PathVariable Long id) {
        adminService.eliminarAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
