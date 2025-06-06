package com.example.springboot.dto;

    public class CarritoRequest {
        private Long compradorId;
        private Long productoId;


        public CarritoRequest(){}

        public CarritoRequest(Long compradorId, Long productoId) {
            this.compradorId = compradorId;
            this.productoId = productoId;
        }

        public Long getCompradorId() {
            return compradorId;
        }

        public void setCompradorId(Long compradorId) {
            this.compradorId = compradorId;
        }

        public Long getProductoId() {
            return productoId;
        }

        public void setProductoId(Long productoId) {
            this.productoId = productoId;
        }
    }

