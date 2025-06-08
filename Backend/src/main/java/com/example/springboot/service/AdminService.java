package com.example.springboot.service;

import com.example.springboot.model.Admin;
import com.example.springboot.model.Producto;
import com.example.springboot.repository.AdminRepository;
import com.example.springboot.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProductoRepository productoRepository;

    public List<Admin> listarAdmins() {
        return adminRepository.findAll();
    }

    public Admin guardarAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin buscarPorId(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    public Admin buscarPorEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public void eliminarAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    public boolean existePorUsuario(String usuario) {
        return adminRepository.existsByUsuario(usuario);
    }

    public Admin login(String email, String rawPassword) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null && passwordEncoder.matches(rawPassword, admin.getPassword())) {
            return admin;
        }
        return null;
    }

    @Transactional
    public void agregarProductoAlCarrito(Long adminId, Long productoId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        admin.getProductos().add(producto);
        adminRepository.save(admin);
    }

    @Transactional
    public void quitarProductoDelCarrito(Long adminId, Long productoId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        admin.getProductos().remove(producto);
        adminRepository.save(admin);
    }

    @Transactional
    public void limpiarCarrito(Long adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));

        admin.getProductos().clear();
        adminRepository.save(admin);
    }

    public List<Producto> obtenerProductosDelCarrito(Long adminId) {
        Admin admin = adminRepository.findById(adminId).orElse(null);
        if (admin != null) {
            return admin.getProductos();
        }
        return Collections.emptyList();
    }

    public List<Producto> obtenerProductosDelCarritoPorEmail(String email) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null) {
            return admin.getProductos();
        }
        return Collections.emptyList();
    }

}
