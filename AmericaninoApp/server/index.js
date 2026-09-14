import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { defaultProducts } from '../src/data/products.js';

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

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  return res.json({ product });
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
