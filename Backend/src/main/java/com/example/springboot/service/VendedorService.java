package com.example.springboot.service;

import com.example.springboot.model.Producto;
import com.example.springboot.model.Vendedor;
import com.example.springboot.repository.ProductoRepository;
import com.example.springboot.repository.VendedorRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class VendedorService {

    @Autowired
    private VendedorRepository vendedorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProductoRepository productoRepository;

    public List<Vendedor> listarVendedores() {
        return vendedorRepository.findAll();
    }

    public Vendedor guardarVendedor(Vendedor vendedor) {
        return vendedorRepository.save(vendedor);
    }

    public Vendedor buscarPorId(Long id) {
        return vendedorRepository.findById(id).orElse(null);
    }

    public Vendedor buscarPorEmail(String email) {
        return vendedorRepository.findByEmail(email);
    }

    public void eliminarVendedor(Long id) {
        vendedorRepository.deleteById(id);
    }

    public Vendedor login(String email, String rawPassword) {
        Vendedor vendedor = vendedorRepository.findByEmail(email);
        if (vendedor != null && passwordEncoder.matches(rawPassword, vendedor.getPassword())) {
            return vendedor;
        }
        return null;
    }

    public boolean existePorUsuario(String usuario) {
        return vendedorRepository.existsByUsuario(usuario);
    }

    public Vendedor findByEmail(String email) {
        return vendedorRepository.findByEmail(email);
    }

    public Vendedor findByUsuario(String usuario) {
        return vendedorRepository.findByUsuario(usuario);
    }

    @Transactional
    public void agregarProductoAlCarrito(Long vendedorId, Long productoId) {
        Vendedor vendedor = vendedorRepository.findById(vendedorId)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        vendedor.getCarrito().add(producto);
        vendedorRepository.save(vendedor);
    }

    @Transactional
    public void quitarProductoDelCarrito(Long vendedorId, Long productoId) {
        Vendedor vendedor = vendedorRepository.findById(vendedorId)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        vendedor.getCarrito().remove(producto);
        vendedorRepository.save(vendedor);
    }

    @Transactional
    public void limpiarCarrito(Long vendedorId) {
        Vendedor vendedor = vendedorRepository.findById(vendedorId)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        vendedor.getCarrito().clear();
        vendedorRepository.save(vendedor);
    }

    public List<Producto> obtenerProductosDelCarrito(Long vendedorId) {
        Vendedor vendedor = vendedorRepository.findById(vendedorId).orElse(null);
        if (vendedor != null) {
            return vendedor.getCarrito();
        }
        return Collections.emptyList();
    }

    public List<Producto> obtenerProductosDelCarritoPorEmail(String email) {
        Vendedor vendedor = vendedorRepository.findByEmail(email);
        if (vendedor != null) {
            return vendedor.getCarrito();
        }
        return Collections.emptyList();
    }
}
