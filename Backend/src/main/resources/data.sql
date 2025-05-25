INSERT INTO categoria (id, nombre) VALUES (1, 'Ropa');
INSERT INTO vendedor (id, nombre) VALUES (1, 'Vendedor Demo');

INSERT INTO producto (descripcion, nombre, precio, imagen, categoria_id, vendedor_id)
VALUES 
('Camiseta blanca talla M', 'Camiseta', 15.99, 'camiseta.jpg', 1, 1),
('Pantalón vaquero azul', 'Pantalón', 29.99, 'pantalon.jpg', 1, 1);
