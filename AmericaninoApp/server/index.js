import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT) || 4001;

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 'denim-clara',
    name: 'Chaqueta Denim Clara',
    price: 229900,
    category: 'Mujer',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85',
    badge: 'Nuevo',
  },
  {
    id: 'camisa-esencial',
    name: 'Camisa Esencial',
    price: 149900,
    category: 'Hombre',
    image:
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'vestido-midi',
    name: 'Vestido Midi Negro',
    price: 219900,
    category: 'Mujer',
    image:
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=700&q=85',
    badge: '-30%',
    oldPrice: 219900,
  },
  {
    id: 'cargo-verde',
    name: 'Pantalón Cargo Verde',
    price: 199900,
    category: 'Mujer',
    image:
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'top-punto',
    name: 'Top Punto Blanco',
    price: 99900,
    category: 'Mujer',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'blazer-beige',
    name: 'Blazer Textura Beige',
    price: 299900,
    category: 'Hombre',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'gafas-01',
    name: 'Gafas Solar 01',
    price: 129900,
    category: 'Accesorios',
    image:
      'https://images.unsplash.com/photo-1577803947579-9f7a3d5c5a32?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'collar-dorado',
    name: 'Collar Cadena Dorado',
    price: 89900,
    category: 'Accesorios',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=85',
  },
];

app.get('/api/products', (_req, res) => {
  res.json({ products });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  return res.json({ product });
});

app.post('/api/orders', (req, res) => {
  const { items = [] } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Debes agregar productos antes de confirmar el pedido' });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderNumber = `AM-${Date.now().toString().slice(-6)}`;

  return res.json({
    success: true,
    orderNumber,
    total,
    message: 'Pedido confirmado en modo demostración',
  });
});

app.listen(port, () => {
  console.log(`Americanino API running on http://localhost:${port}`);
});
