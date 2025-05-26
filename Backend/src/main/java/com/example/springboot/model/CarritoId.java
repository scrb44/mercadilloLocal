package com.example.springboot.model;

import java.io.Serializable;

public class CarritoId implements Serializable {
    private Long idUser;
    private Long idProd;

    public CarritoId(Long idUser, Long idProd) {
        this.idUser = idUser;
        this.idProd = idProd;
    }

    public Long getIdUser() {
        return idUser;
    }

    public Long getIdProd() {
        return idProd;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public void setIdProd(Long idProd) {
        this.idProd = idProd;
    }
}
