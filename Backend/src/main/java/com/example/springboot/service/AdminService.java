package com.example.springboot.service;

import com.example.springboot.model.Admin;
import com.example.springboot.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> listarAdmins() {
        return adminRepository.findAll();
    }

    public Admin guardarAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin buscarPorId(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    public void eliminarAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    public boolean existePorUsuario(String usuario) {
        return adminRepository.existsByUsuario(usuario);
    }

    public Admin login(String email, String password) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null && admin.getPassword().equals(password)) {
            return admin;
        }
        return null;
    }

}
