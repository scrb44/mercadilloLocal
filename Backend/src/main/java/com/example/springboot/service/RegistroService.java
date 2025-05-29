package com.example.springboot.service;

import com.example.springboot.model.Comprador;
import com.example.springboot.repository.AdminRepository;
import com.example.springboot.repository.CompradorRepository;
import com.example.springboot.repository.VendedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegistroService {

    @Autowired
    private CompradorRepository compradorRepository;

    @Autowired
    private VendedorRepository vendedorRepository;

    @Autowired
    private AdminRepository adminRepository;

    public String registrarComprador(Comprador comprador) {
        String usuario = comprador.getUsuario();

        boolean existe = compradorRepository.existsByUsuario(usuario)
                || vendedorRepository.existsByUsuario(usuario)
                || adminRepository.existsByUsuario(usuario);

        if (existe) {
            return "Error: Usuario ya existente";
        }

        compradorRepository.save(comprador);
        return "Comprador registrado correctamente";
    }
}
