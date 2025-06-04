package com.example.springboot.service;

import com.example.springboot.model.Localidad;
import com.example.springboot.repository.ProvinciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProvinciaService {

    private final ProvinciaRepository provinciaRepository;

    @Autowired
    public ProvinciaService(ProvinciaRepository provinciaRepository) {
        this.provinciaRepository = provinciaRepository;
    }

    public List<Localidad> getAllProvincias() {
        return provinciaRepository.findAll();
    }

    public Localidad getProvinciaById(Long id) {
        return provinciaRepository.findById(id).orElse(null);
    }

    public Localidad saveProvincia(Localidad localidad) {
        return provinciaRepository.save(localidad);
    }

    public void deleteProvincia(Long id) {
        provinciaRepository.deleteById(id);
    }

    public Localidad getProvinciaByNombre(String nombre) {
        return provinciaRepository.findByNombre(nombre);
    }

}
