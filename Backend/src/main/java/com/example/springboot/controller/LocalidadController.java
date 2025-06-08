package com.example.springboot.controller;

import com.example.springboot.model.Localidad;
import com.example.springboot.service.LocalidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/localidad")
@CrossOrigin(origins = "*")
public class LocalidadController {

    private final LocalidadService localidadService;

    @Autowired
    public LocalidadController(LocalidadService localidadService) {
        this.localidadService = localidadService;
    }

    @GetMapping
    public List<Localidad> getAll() {
        return localidadService.getAllProvincias();
    }

    @GetMapping("/{id}")
    public Localidad getById(@PathVariable Long id) {
        return localidadService.getProvinciaById(id);
    }

    @PostMapping
    public Localidad create(@RequestBody Localidad localidad) {
        return localidadService.saveProvincia(localidad);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        localidadService.deleteProvincia(id);
    }
}
