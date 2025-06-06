package com.example.springboot.service;

import com.example.springboot.model.Admin;
import com.example.springboot.model.Vendedor;
import com.example.springboot.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Admin> listarAdmins() {
        return adminRepository.findAll();
    }

    public Admin guardarAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin buscarPorId(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    public Admin buscarPorEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public void eliminarAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    public boolean existePorUsuario(String usuario) {
        return adminRepository.existsByUsuario(usuario);
    }

    public Admin login(String email, String rawPassword) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null && passwordEncoder.matches(rawPassword, admin.getPassword())) {
            return admin;
        }
        return null;
    }




}
