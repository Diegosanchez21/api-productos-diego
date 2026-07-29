import cors from 'cors';
import express from 'express';
import mysql from 'mysql2/promise';

const aplicacion = express();
const puerto = Number(process.env.PORT ?? 3000);

const origenesPermitidos = (
  process.env.ORIGENES_PERMITIDOS ?? 'http://localhost:4200'
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
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT ?? 3306),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 5,
  decimalNumbers: true
});

function validarProducto(datos) {
  const producto = {
    nombre: String(datos.nombre ?? '').trim(),
    descripcion: String(datos.descripcion ?? '').trim(),
    precio: Number(datos.precio)
  };

  if (
    !producto.nombre ||
    !producto.descripcion ||
    !Number.isFinite(producto.precio) ||
    producto.precio <= 0
  ) {
    return null;
  }

  return producto;
}

aplicacion.get('/', (_solicitud, respuesta) => {
  respuesta.json({ mensaje: 'API de productos en funcionamiento.' });
});

aplicacion.get('/api/productos', async (_solicitud, respuesta) => {
  try {
    const [productos] = await conexion.query(
      `SELECT id, nombre, descripcion, precio
       FROM productos ORDER BY id`
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
      `SELECT id, nombre, descripcion, precio
       FROM productos WHERE id = ?`,
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
      `INSERT INTO productos (nombre, descripcion, precio)
       VALUES (?, ?, ?)`,
      [producto.nombre, producto.descripcion, producto.precio]
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
       SET nombre = ?, descripcion = ?, precio = ?
       WHERE id = ?`,
      [
        producto.nombre,
        producto.descripcion,
        producto.precio,
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

aplicacion.use((error, _solicitud, respuesta, _continuar) => {
  console.error(error);
  respuesta.status(403).json({ mensaje: error.message });
});

aplicacion.listen(puerto, '0.0.0.0', () => {
  console.log(`API disponible en el puerto ${puerto}.`);
});