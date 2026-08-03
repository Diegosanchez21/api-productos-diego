INSERT INTO productos (nombre, descripcion, precio)
VALUES
  ('Teclado', 'Teclado compacto para practicar Angular.', 650.00),
  ('Ratón', 'Ratón inalámbrico de uso diario.', 420.00),
  ('Monitor', 'Monitor de 24 pulgadas.', 3200.00);

SELECT id, nombre, descripcion, precio, creado_en
FROM productos
ORDER BY id;