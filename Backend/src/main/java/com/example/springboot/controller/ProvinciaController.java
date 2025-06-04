package com.example.springboot.controller;

import com.example.springboot.model.Localidad;
import com.example.springboot.service.ProvinciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/provincias")
@CrossOrigin(origins = "*")
public class ProvinciaController {

    private final ProvinciaService provinciaService;

    @Autowired
    public ProvinciaController(ProvinciaService provinciaService) {
        this.provinciaService = provinciaService;
    }

    @GetMapping
    public List<Localidad> getAll() {
        return provinciaService.getAllProvincias();
    }

    @GetMapping("/{id}")
    public Localidad getById(@PathVariable Long id) {
        return provinciaService.getProvinciaById(id);
    }

    @PostMapping
    public Localidad create(@RequestBody Localidad localidad) {
        return provinciaService.saveProvincia(localidad);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        provinciaService.deleteProvincia(id);
    }
}
