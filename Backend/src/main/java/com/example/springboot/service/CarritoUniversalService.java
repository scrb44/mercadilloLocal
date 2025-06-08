package com.example.springboot.service;

import com.example.springboot.model.Admin;
import com.example.springboot.model.Comprador;
import com.example.springboot.model.Vendedor;
import com.example.springboot.model.Producto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;

@Service
public class CarritoUniversalService {

    @Autowired
    private CompradorService compradorService;

    @Autowired
    private VendedorService vendedorService;

    @Autowired
    private AdminService adminService;

    public Long obtenerCompradorIdPorEmail(String email) {
        Comprador comprador = compradorService.buscarPorEmail(email);
        if (comprador == null) {
            throw new RuntimeException("Comprador no encontrado con email: " + email);
        }
        return comprador.getId();
    }

    public Long obtenerVendedorIdPorEmail(String email) {
        Vendedor vendedor = vendedorService.buscarPorEmail(email);
        if (vendedor == null) {
            throw new RuntimeException("Vendedor no encontrado con email: " + email);
        }
        return vendedor.getId();
    }

    public Long obtenerAdminIdPorEmail(String email) {
        Admin admin = adminService.buscarPorEmail(email);
        if (admin == null) {
            throw new RuntimeException("Admin no encontrado con email: " + email);
        }
        return admin.getId();
    }

    public Long obtenerUsuarioIdPorEmailYTipo(String email, String tipoUsuario) {
        switch (tipoUsuario.toUpperCase()) {
            case "COMPRADOR":
                return obtenerCompradorIdPorEmail(email);
            case "VENDEDOR":
                return obtenerVendedorIdPorEmail(email);
            case "ADMIN":
                return obtenerAdminIdPorEmail(email);
            default:
                throw new RuntimeException("Tipo de usuario no válido: " + tipoUsuario);
        }
    }

    public void agregarProductoAlCarrito(Long usuarioId, String tipoUsuario, Long productoId) {
        switch (tipoUsuario.toUpperCase()) {
            case "COMPRADOR":
                compradorService.agregarProductoAlCarrito(usuarioId, productoId);
                break;
            case "VENDEDOR":
                vendedorService.agregarProductoAlCarrito(usuarioId, productoId);
                break;
            case "ADMIN":
                adminService.agregarProductoAlCarrito(usuarioId, productoId);
                break;
            default:
                throw new RuntimeException("Tipo de usuario no válido: " + tipoUsuario);
        }
    }

    public void quitarProductoDelCarrito(Long usuarioId, String tipoUsuario, Long productoId) {
        switch (tipoUsuario.toUpperCase()) {
            case "COMPRADOR":
                compradorService.quitarProductoDelCarrito(usuarioId, productoId);
                break;
            case "VENDEDOR":
                vendedorService.quitarProductoDelCarrito(usuarioId, productoId);
                break;
            case "ADMIN":
                adminService.quitarProductoDelCarrito(usuarioId, productoId);
                break;
            default:
                throw new RuntimeException("Tipo de usuario no válido: " + tipoUsuario);
        }
    }

    public void limpiarCarrito(Long usuarioId, String tipoUsuario) {
        switch (tipoUsuario.toUpperCase()) {
            case "COMPRADOR":
                compradorService.limpiarCarrito(usuarioId);
                break;
            case "VENDEDOR":
                vendedorService.limpiarCarrito(usuarioId);
                break;
            case "ADMIN":
                adminService.limpiarCarrito(usuarioId);
                break;
            default:
                throw new RuntimeException("Tipo de usuario no válido: " + tipoUsuario);
        }
    }

    public List<Producto> obtenerProductosDelCarrito(Long usuarioId, String tipoUsuario) {
        switch (tipoUsuario.toUpperCase()) {
            case "COMPRADOR":
                return compradorService.obtenerProductosDelCarritoPorId(usuarioId);
            case "VENDEDOR":
                return vendedorService.obtenerProductosDelCarrito(usuarioId);
            case "ADMIN":
                return adminService.obtenerProductosDelCarrito(usuarioId);
            default:
                throw new RuntimeException("Tipo de usuario no válido: " + tipoUsuario);
        }
    }

    public List<Producto> obtenerProductosDelCarritoPorEmail(String email, String tipoUsuario) {
        switch (tipoUsuario.toUpperCase()) {
            case "COMPRADOR":
                return compradorService.obtenerProductosDelCarritoPorEmail(email);
            case "VENDEDOR":
                return vendedorService.obtenerProductosDelCarritoPorEmail(email);
            case "ADMIN":
                return adminService.obtenerProductosDelCarritoPorEmail(email);
            default:
                return Collections.emptyList();
        }
    }
}