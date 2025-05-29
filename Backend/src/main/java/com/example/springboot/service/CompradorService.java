package com.example.springboot.service;

import com.example.springboot.model.Comprador;
import com.example.springboot.model.Producto;
import com.example.springboot.repository.CompradorRepository;
import com.example.springboot.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class CompradorService {

    @Autowired
    private CompradorRepository compradorRepository;

    @Autowired
    private ProductoRepository productoRepository;

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

    public Comprador login(String usuario, String password) {
        return compradorRepository.findByUsuarioAndPassword(usuario, password);
    }

    public boolean existePorUsuario(String usuario) {
        return compradorRepository.existsByUsuario(usuario);
    }

    public Comprador findByEmail(String email) {
        return compradorRepository.findByEmail(email);
    }

    public Comprador agregarProductoAlCarrito(String emailComprador, Long idProducto) {
        Comprador comprador = compradorRepository.findByEmail(emailComprador);
        if (comprador == null) {
            throw new RuntimeException("Comprador no encontrado");
        }

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        List<Producto> carrito = comprador.getProductos();
        if (carrito == null) {
            carrito = new ArrayList<>();
            comprador.setProductos(carrito);
        }

        // Evitar duplicados si quieres
        if (!carrito.contains(producto)) {
            carrito.add(producto);
        }

        comprador.setProductos(carrito);

        return compradorRepository.save(comprador);
    }
}

