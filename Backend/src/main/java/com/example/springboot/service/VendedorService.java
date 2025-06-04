package com.example.springboot.service;

import com.example.springboot.model.Comprador;
import com.example.springboot.model.Vendedor;
import com.example.springboot.repository.VendedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendedorService {

    @Autowired
    private VendedorRepository vendedorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public List<Vendedor> listarVendedores() {
        return vendedorRepository.findAll();
    }

    public Vendedor guardarVendedor(Vendedor vendedor) {
        return vendedorRepository.save(vendedor);
    }

    public Vendedor buscarPorId(Long id) {
        return vendedorRepository.findById(id).orElse(null);
    }

    public void eliminarVendedor(Long id) {
        vendedorRepository.deleteById(id);
    }


    public Vendedor login(String email, String rawPassword) {
        Vendedor vendedor= vendedorRepository.findByEmail(email);
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

}
