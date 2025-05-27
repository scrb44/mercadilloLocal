package com.example.springboot.service;

import com.example.springboot.model.Comprador;
import com.example.springboot.repository.CompradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompradorService {

    @Autowired
    private CompradorRepository compradorRepository;

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

    public Comprador login(String usuario, String contraseña) {
        return compradorRepository.findByUsuarioAndContraseña(usuario, contraseña);
    }

    public boolean existePorUsuario(String usuario) {
        return compradorRepository.existsByUsuario(usuario);
    }

}
