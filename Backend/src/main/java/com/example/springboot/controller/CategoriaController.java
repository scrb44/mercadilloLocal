package com.example.springboot.controller;

import com.example.springboot.model.Categoria;
import com.example.springboot.model.Producto;
import com.example.springboot.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categoria")
@CrossOrigin(origins = "*")
public class CategoriaController {

    @Autowired
    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping()
    public List<Categoria> obtenerCagorias(@RequestParam(required = false) Long localidad) {
        if(localidad == null)
            return categoriaService.obtenerTodos();
        else
            return categoriaService.categoriasConProductos(localidad);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerComprador(@PathVariable Long id) {
        Categoria categoria = categoriaService.buscarPorId(id);

        if (categoria != null) {
            return ResponseEntity.ok(categoria);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Categoria agregarCategoria(@RequestBody Categoria categoria) {
        return categoriaService.agregarCategoria(categoria);
    }

    @GetMapping("/Categoria/{id}")
    public void eliminarCategoria(long id) {
        categoriaService.eliminarCategoria(id);
    }
}
