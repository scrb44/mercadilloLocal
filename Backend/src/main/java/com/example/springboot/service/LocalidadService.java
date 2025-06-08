package com.example.springboot.service;

import com.example.springboot.model.Localidad;
import com.example.springboot.repository.LocalidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocalidadService {

    private final LocalidadRepository localidadRepository;

    @Autowired
    public LocalidadService(LocalidadRepository localidadRepository) {
        this.localidadRepository = localidadRepository;
    }

    public List<Localidad> getAllProvincias() {
        return localidadRepository.findAll();
    }

    public Localidad getProvinciaById(Long id) {
        return localidadRepository.findById(id).orElse(null);
    }

    public Localidad saveProvincia(Localidad localidad) {
        return localidadRepository.save(localidad);
    }

    public void deleteProvincia(Long id) {
        localidadRepository.deleteById(id);
    }

    public List<Localidad> getProvinciasConVendedores(){return localidadRepository.findconvendedores();}

    public Localidad getProvinciaByNombre(String nombre) {
        return localidadRepository.findByNombre(nombre);
    }

}
