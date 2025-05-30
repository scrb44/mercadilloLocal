package com.example.springboot.service;

import com.example.springboot.model.Vendedor;
import com.example.springboot.repository.VendedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendedorService {

    @Autowired
    private VendedorRepository vendedorRepository;

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

    public Vendedor login(String email, String password) {
        Vendedor vendedor = vendedorRepository.findByEmail(email);
        if (vendedor != null && vendedor.getPassword().equals(password)) {
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

}
