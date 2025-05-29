package com.example.springboot.service;

import com.example.springboot.model.Provincia;
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

    public List<Provincia> getAllProvincias() {
        return provinciaRepository.findAll();
    }

    public Provincia getProvinciaById(Long id) {
        return provinciaRepository.findById(id).orElse(null);
    }

    public Provincia saveProvincia(Provincia provincia) {
        return provinciaRepository.save(provincia);
    }

    public void deleteProvincia(Long id) {
        provinciaRepository.deleteById(id);
    }

    public Provincia getProvinciaByNombre(String nombre) {
        return provinciaRepository.findByNombre(nombre);
    }

}
