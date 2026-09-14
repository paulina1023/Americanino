import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

import { defaultProducts } from '../src/data/products.js';

import dotenv from 'dotenv';

dotenv.config();


const app = express();
const port = Number(process.env.PORT) || 4001;
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Americanino',
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(cors());
app.use(express.json());


async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      category VARCHAR(80) NOT NULL,
      price INT UNSIGNED NOT NULL,
      old_price INT UNSIGNED NULL,
      image VARCHAR(500) NOT NULL,
      badge VARCHAR(40) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      order_number VARCHAR(32) NOT NULL UNIQUE,
      total INT UNSIGNED NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      order_id BIGINT UNSIGNED NOT NULL,
      product_id VARCHAR(80) NOT NULL,
      product_name VARCHAR(160) NOT NULL,
      unit_price INT UNSIGNED NOT NULL,
      quantity INT UNSIGNED NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM products');
  if (rows[0].count === 0) {
    const values = defaultProducts.map((product) => [
      product.id,
      product.name,
      product.category,
      product.price,
      product.oldPrice || null,
      product.image,
      product.badge || null,
    ]);
    await pool.query(
      'INSERT INTO products (id, name, category, price, old_price, image, badge) VALUES ?',
      [values],
    );
  }
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ status: 'ok', database: 'connected' });
  } catch {
    return res.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

app.get('/api/products', async (_req, res) => {
  const [products] = await pool.query(
    'SELECT id, name, category, price, old_price AS oldPrice, image, badge FROM products ORDER BY created_at, name',
  );
  res.json({ products });
});

app.get('/api/products/:id', async (req, res) => {
  const [products] = await pool.query(
    'SELECT id, name, category, price, old_price AS oldPrice, image, badge FROM products WHERE id = ?',
    [req.params.id],
  );
  const [product] = products;

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'americanino_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function ensureDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        old_price DECIMAL(10,2) DEFAULT NULL,
        badge VARCHAR(50) DEFAULT NULL,
        image VARCHAR(500) NOT NULL
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);


    const [rows] = await connection.query('SELECT COUNT(*) AS total FROM products');
    if (rows[0].total === 0) {
      await connection.query(`
        INSERT INTO products (slug, name, category, price, old_price, badge, image) VALUES
        ('denim-clara', 'Chaqueta Denim Clara', 'Mujer', 229900, 269900, 'Nuevo', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85'),
        ('vestido-midi', 'Vestido Midi Negro', 'Mujer', 153930, 219900, '-30%', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=85'),
        ('cargo-verde', 'Pantalón Cargo Verde', 'Mujer', 199900, NULL, NULL, 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85'),
        ('top-punto', 'Top Punto Blanco', 'Mujer', 99900, NULL, NULL, 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85'),
        ('camisa-esencial', 'Camisa Esencial', 'Hombre', 149900, NULL, NULL, 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=85'),
        ('blazer-beige', 'Blazer Textura Beige', 'Hombre', 299900, NULL, 'Premium', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=85'),
        ('gafas-01', 'Gafas Solar 01', 'Accesorios', 129900, NULL, NULL, 'https://images.unsplash.com/photo-1577803947579-9f7a3d5c5a32?auto=format&fit=crop&w=700&q=85'),
        ('collar-dorado', 'Collar Cadena Dorado', 'Accesorios', 89900, NULL, NULL, 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=85'),
        ('chaqueta-utility', 'Chaqueta Utility Negra', 'Lluvia', 279900, NULL, NULL, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85'),
        ('polo-essential', 'Polo Essential Verde', 'Sale', 119900, 179900, 'Sale', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85');
      `);
    }

    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error.message);
  }
}

app.get('/api/products', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json({ products: rows.map((product) => ({
      id: product.slug,
      name: product.name,
      category: product.category,
      price: Number(product.price),
      oldPrice: product.old_price ? Number(product.old_price) : null,
      image: product.image,
      badge: product.badge,
    })) });
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar productos', error: error.message });
  }
});


app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE slug = ?', [req.params.id]);
    const product = rows[0];

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.json({
      product: {
        id: product.slug,
        name: product.name,
        category: product.category,
        price: Number(product.price),
        oldPrice: product.old_price ? Number(product.old_price) : null,
        image: product.image,
        badge: product.badge,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al consultar producto', error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const { items = [] } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Debes agregar productos antes de confirmar el pedido' });
  }


  const quantities = new Map(items.map((item) => [item.id, Number(item.quantity)]));
  const ids = [...quantities.keys()];
  const [products] = await pool.query(
    'SELECT id, name, price FROM products WHERE id IN (?)',
    [ids],
  );

  if (products.length !== ids.length || products.some((product) => !Number.isInteger(quantities.get(product.id)) || quantities.get(product.id) < 1)) {
    return res.status(400).json({ message: 'El pedido contiene productos o cantidades inválidas' });
  }

  const total = products.reduce((sum, product) => sum + product.price * quantities.get(product.id), 0);
  const orderNumber = `AM-${Date.now().toString().slice(-6)}`;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [order] = await connection.query(
      'INSERT INTO orders (order_number, total) VALUES (?, ?)',
      [orderNumber, total],
    );
    await connection.query(
      'INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity) VALUES ?',
      [products.map((product) => [order.insertId, product.id, product.name, product.price, quantities.get(product.id)])],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return res.json({
    success: true,
    orderNumber,
    total,
    message: 'Pedido confirmado correctamente',
  });
});

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Americanino API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo inicializar la base de datos:', error.message);
    process.exitCode = 1;
  });

  try {
    const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const orderNumber = `AM-${Date.now().toString().slice(-6)}`;

    const [result] = await pool.query(
      'INSERT INTO orders (order_number, total) VALUES (?, ?)',
      [orderNumber, total],
    );

    for (const item of items) {
      const [productRow] = await pool.query('SELECT id FROM products WHERE slug = ?', [item.id]);
      if (productRow[0]) {
        await pool.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [result.insertId, productRow[0].id, item.quantity, item.price],
        );
      }
    }

    return res.json({
      success: true,
      orderNumber,
      total,
      message: 'Pedido confirmado en modo demostración',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al guardar el pedido', error: error.message });
  }
});

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

await ensureDatabase();

app.listen(port, () => {
  console.log(`Americanino API running on http://localhost:${port}`);
});

