package com.example.springboot.controller;

import com.example.springboot.model.Categoria;
import com.example.springboot.model.Producto;
import com.example.springboot.service.CategoriaService;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/Categoria")
@CrossOrigin(origins = "*")
public class CategoriaController {

private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping()
    public List<Categoria> obtenerCagorias(@RequestParam(required = false) Long localidadId) {
//        return categoriaService.obtenerTodos().stream()
//            .filter(p -> p.getProductos() != null)
//            .collect(Collectors.toList());
     //   return categoriaService.categoriasConProductos(localidadId);
        return categoriaService.categoriasConProductos(localidadId);
    }

/*
    @GetMapping("/categorias")
    public List<Categoria> obtener( @RequestParam(required = false) Long id) {
        return categoriaService.unir();
    }
*/
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
