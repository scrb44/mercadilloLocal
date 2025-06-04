package com.example.springboot.service;

import com.example.springboot.model.Comprador;
import com.example.springboot.model.Producto;
import com.example.springboot.repository.CompradorRepository;
import com.example.springboot.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class CompradorService {

    @Autowired
    private CompradorRepository compradorRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Comprador> listarCompradores() {
        return compradorRepository.findAll();
    }

    public Comprador guardarComprador(Comprador comprador) {
        return compradorRepository.save(comprador);
    }

    public Comprador buscarPorId(Long id) {
        return compradorRepository.findById(id).orElse(null);
    }

    public void eliminarComprador(Long id) {
        compradorRepository.deleteById(id);
    }

    public Comprador login(String email, String rawPassword) {
        Comprador comprador = compradorRepository.findByEmail(email);
        if (comprador == null) {
            System.out.println("No existe comprador con email: " + email);
            return null;
        }
        System.out.println("Contraseña almacenada: " + comprador.getPassword());
        System.out.println("Contraseña recibida: " + rawPassword);
        boolean matches = passwordEncoder.matches(rawPassword, comprador.getPassword());
        System.out.println("¿Coinciden las contraseñas? " + matches);
        if (matches) {
            return comprador;
        }
        return null;
    }

    public boolean existePorUsuario(String usuario) {
        return compradorRepository.existsByUsuario(usuario);
    }

    public Comprador findByEmail(String email) {
        return compradorRepository.findByEmail(email);
    }

    public void agregarProductoAlCarrito(String usuario, Long idProducto) {
        Comprador comprador = compradorRepository.findByUsuario(usuario);
        if (comprador == null) {
            throw new RuntimeException("Comprador no encontrado");
        }

        Producto producto = productoRepository.findById(idProducto).orElse(null);
        if (producto == null) {
            throw new RuntimeException("Producto no encontrado");
        }

        comprador.getProductos().add(producto);
        compradorRepository.save(comprador);
    }

}

