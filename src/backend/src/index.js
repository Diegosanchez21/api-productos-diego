import cors from 'cors';
import express from 'express';
import mysql from 'mysql2/promise';

const aplicacion = express();
const puerto = Number(process.env.PORT ?? 3000);

const origenesPermitidos = (
  process.env.ORIGENES_PERMITIDOS ?? 'http://localhost:4200,https://productos-diego-4fa01.web.app'
)
  .split(',')
  .map((origen) => origen.trim());

aplicacion.use(
  cors({
    origin(origen, continuar) {
      if (!origen || origenesPermitidos.includes(origen)) {
        continuar(null, true);
        return;
      }

      continuar(new Error('Origen no permitido por CORS.'));
    }
  })
);

aplicacion.use(express.json());

const conexion = mysql.createPool({
  host: 'reseau.proxy.rlwy.net',
  port: 39295,
  user: 'root',
  password: 'bjhAqgJUvTHnAFfxzhYGSRJgWnPmZyPD',
  database: 'railway',
  waitForConnections: true,
  connectionLimit: 5,
  decimalNumbers: true
});

function validarProducto(datos) {
  const producto = {
    nombre: String(datos.nombre ?? '').trim(),
    descripcion: String(datos.descripcion ?? '').trim(),
    precio: Number(datos.precio),
    categoriaId: datos.categoriaId === null || datos.categoriaId === ''
      ? null
      : Number(datos.categoriaId)
  };

  if (
    !producto.nombre ||
    !producto.descripcion ||
    !Number.isFinite(producto.precio) ||
    producto.precio <= 0 ||
    (producto.categoriaId !== null && (!Number.isInteger(producto.categoriaId) || producto.categoriaId <= 0))
  ) {
    return null;
  }

  return producto;
}

function validarCategoria(datos) {
  const nombre = String(datos.nombre ?? '').trim();
  return nombre && nombre.length <= 100 ? { nombre } : null;
}

const columnasProducto = `p.id, p.nombre, p.descripcion, p.precio,
  p.categoria_id AS categoriaId, c.nombre AS categoriaNombre`;
const relacionCategoria = 'FROM productos p LEFT JOIN categorias c ON c.id = p.categoria_id';

aplicacion.get('/', (_solicitud, respuesta) => {
  respuesta.json({ mensaje: 'API de productos en funcionamiento.' });
});

aplicacion.get('/api/productos', async (_solicitud, respuesta) => {
  try {
    const [productos] = await conexion.query(
      `SELECT ${columnasProducto} ${relacionCategoria} ORDER BY p.id`
    );
    respuesta.json(productos);
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'No fue posible consultar.' });
  }
});

aplicacion.get('/api/productos/:id', async (solicitud, respuesta) => {
  try {
    const [productos] = await conexion.execute(
      `SELECT ${columnasProducto} ${relacionCategoria} WHERE p.id = ?`,
      [solicitud.params.id]
    );

    if (productos.length === 0) {
      respuesta.status(404).json({ mensaje: 'Producto no encontrado.' });
      return;
    }

    respuesta.json(productos[0]);
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'No fue posible consultar.' });
  }
});

aplicacion.post('/api/productos', async (solicitud, respuesta) => {
  const producto = validarProducto(solicitud.body);

  if (!producto) {
    respuesta.status(400).json({ mensaje: 'Los datos no son válidos.' });
    return;
  }

  try {
    const [resultado] = await conexion.execute(
      `INSERT INTO productos (nombre, descripcion, precio, categoria_id)
       VALUES (?, ?, ?, ?)`,
      [producto.nombre, producto.descripcion, producto.precio, producto.categoriaId]
    );

    respuesta.status(201).json({ id: resultado.insertId, ...producto });
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'No fue posible guardar.' });
  }
});

aplicacion.put('/api/productos/:id', async (solicitud, respuesta) => {
  const producto = validarProducto(solicitud.body);

  if (!producto) {
    respuesta.status(400).json({ mensaje: 'Los datos no son válidos.' });
    return;
  }

  try {
    const [resultado] = await conexion.execute(
      `UPDATE productos
       SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ?
       WHERE id = ?`,
      [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.categoriaId,
        solicitud.params.id
      ]
    );

    if (resultado.affectedRows === 0) {
      respuesta.status(404).json({ mensaje: 'Producto no encontrado.' });
      return;
    }

    respuesta.json({ id: Number(solicitud.params.id), ...producto });
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'No fue posible actualizar.' });
  }
});

aplicacion.delete('/api/productos/:id', async (solicitud, respuesta) => {
  try {
    const [resultado] = await conexion.execute(
      'DELETE FROM productos WHERE id = ?',
      [solicitud.params.id]
    );

    if (resultado.affectedRows === 0) {
      respuesta.status(404).json({ mensaje: 'Producto no encontrado.' });
      return;
    }

    respuesta.status(204).send();
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'No fue posible eliminar.' });
  }
});

aplicacion.get('/api/categorias', async (_solicitud, respuesta) => {
  try {
    const [categorias] = await conexion.query(
      `SELECT c.id, c.nombre, c.creado_en AS creadoEn, COUNT(p.id) AS totalProductos
       FROM categorias c LEFT JOIN productos p ON p.categoria_id = c.id
       GROUP BY c.id ORDER BY c.nombre`
    );
    respuesta.json(categorias);
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'No fue posible consultar las categorías.' });
  }
});

aplicacion.post('/api/categorias', async (solicitud, respuesta) => {
  const categoria = validarCategoria(solicitud.body);
  if (!categoria) return respuesta.status(400).json({ mensaje: 'El nombre de la categoría no es válido.' });
  try {
    const [resultado] = await conexion.execute('INSERT INTO categorias (nombre) VALUES (?)', [categoria.nombre]);
    respuesta.status(201).json({ id: resultado.insertId, ...categoria, totalProductos: 0 });
  } catch (error) {
    console.error(error);
    respuesta.status(error.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ mensaje: 'No fue posible guardar la categoría.' });
  }
});

aplicacion.put('/api/categorias/:id', async (solicitud, respuesta) => {
  const categoria = validarCategoria(solicitud.body);
  if (!categoria) return respuesta.status(400).json({ mensaje: 'El nombre de la categoría no es válido.' });
  try {
    const [resultado] = await conexion.execute('UPDATE categorias SET nombre = ? WHERE id = ?', [categoria.nombre, solicitud.params.id]);
    if (!resultado.affectedRows) return respuesta.status(404).json({ mensaje: 'Categoría no encontrada.' });
    respuesta.json({ id: Number(solicitud.params.id), ...categoria });
  } catch (error) {
    console.error(error);
    respuesta.status(error.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ mensaje: 'No fue posible actualizar la categoría.' });
  }
});

aplicacion.delete('/api/categorias/:id', async (solicitud, respuesta) => {
  try {
    const [resultado] = await conexion.execute('DELETE FROM categorias WHERE id = ?', [solicitud.params.id]);
    if (!resultado.affectedRows) return respuesta.status(404).json({ mensaje: 'Categoría no encontrada.' });
    respuesta.status(204).send();
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'No fue posible eliminar la categoría.' });
  }
});

aplicacion.get('/api/favoritos', async (_solicitud, respuesta) => {
  try {
    const [favoritos] = await conexion.query(
      `SELECT ${columnasProducto} ${relacionCategoria}
       INNER JOIN favoritos f ON f.producto_id = p.id ORDER BY f.creado_en DESC`
    );
    respuesta.json(favoritos);
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'No fue posible consultar los favoritos.' });
  }
});

aplicacion.post('/api/favoritos/:productoId', async (solicitud, respuesta) => {
  try {
    const [resultado] = await conexion.execute('INSERT INTO favoritos (producto_id) VALUES (?)', [solicitud.params.productoId]);
    respuesta.status(201).json({ id: resultado.insertId, productoId: Number(solicitud.params.productoId) });
  } catch (error) {
    console.error(error);
    const estado = error.code === 'ER_DUP_ENTRY' ? 409 : error.code === 'ER_NO_REFERENCED_ROW_2' ? 404 : 500;
    respuesta.status(estado).json({ mensaje: 'No fue posible agregar el favorito.' });
  }
});

aplicacion.delete('/api/favoritos/:productoId', async (solicitud, respuesta) => {
  try {
    const [resultado] = await conexion.execute('DELETE FROM favoritos WHERE producto_id = ?', [solicitud.params.productoId]);
    if (!resultado.affectedRows) return respuesta.status(404).json({ mensaje: 'Favorito no encontrado.' });
    respuesta.status(204).send();
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'No fue posible eliminar el favorito.' });
  }
});

aplicacion.use((error, _solicitud, respuesta, _continuar) => {
  console.error(error);
  respuesta.status(403).json({ mensaje: error.message });
});

aplicacion.listen(puerto, '0.0.0.0', () => {
  console.log(`API disponible en el puerto ${puerto}.`);
});
