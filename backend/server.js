import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 5000;
// Ruta corregida que apunta a la carpeta 'data' DENTRO de 'backend'
const DB_PATH = path.resolve(process.cwd(), 'data/db.json');

app.use(cors());
app.use(express.json());

let db = { products: [] };
let nextProductId = 1;

async function loadDatabase() {
  try {
    const dbContent = await fs.readFile(DB_PATH, 'utf-8');
    if (dbContent.trim() === '') {
        db = { products: [] };
        await saveDatabase();
        return;
    }
    db = JSON.parse(dbContent);
    if (db.products && db.products.length > 0) {
      nextProductId = Math.max(...db.products.map(p => p.id)) + 1;
    }
    console.log('✅ Base de datos cargada correctamente desde db.json');
  } catch (err) {
    if (err.code === 'ENOENT') {
        db = { products: [] };
        await saveDatabase();
        console.log('✅ Archivo db.json no encontrado, se ha creado uno nuevo.');
    } else {
        console.error('❌ Error al cargar la base de datos:', err);
    }
  }
}

async function saveDatabase() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
    console.log('💾 Base de datos guardada en db.json');
  } catch (err) {
    console.error('❌ Error al guardar la base de datos:', err);
  }
}

loadDatabase();

// --- RUTAS DE LA API ---

// GET /api/products -> Devuelve solo los productos ACTIVOS (para la tienda pública)
app.get('/api/products', (req, res) => {
  const activeProducts = db.products ? db.products.filter(p => p.isActive !== false) : [];
  res.json(activeProducts);
});

// GET /api/admin/products -> Ruta especial para que el admin vea TODOS los productos
app.get('/api/admin/products', (req, res) => {
    res.json(db.products || []);
});

// POST /api/products -> Crea un nuevo producto
app.post('/api/products', async (req, res) => {
  const { name, category, price, description, image } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ message: 'El nombre y el precio son requeridos.' });
  }

  const newProduct = {
    id: nextProductId++,
    name,
    category,
    price: parseFloat(price),
    description,
    image: image || `https://via.placeholder.com/300x300.png?text=${name.replace(/\s/g, '+')}`,
    isActive: true, // Por defecto, un producto está activo
  };

  if (!db.products) db.products = [];
  db.products.push(newProduct);
  await saveDatabase();
  
  res.status(201).json(newProduct);
});

// PUT /api/products/:id -> Actualiza un producto
app.put('/api/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const { name, category, price, description, image } = req.body;
  const productIndex = db.products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  const updatedProduct = { ...db.products[productIndex], name, category, price: parseFloat(price), description, image };
  db.products[productIndex] = updatedProduct;
  await saveDatabase();
  res.json(updatedProduct);
});

// DELETE /api/products/:id -> Desactiva/Activa un producto
app.delete('/api/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const productIndex = db.products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  // Cambiamos el estado: si era true o undefined, pasa a false, y viceversa.
  const currentStatus = db.products[productIndex].isActive;
  db.products[productIndex].isActive = currentStatus === false ? true : false;
  
  await saveDatabase();
  console.log(`DELETE /api/products/${productId} -> Estado de actividad cambiado a ${db.products[productIndex].isActive}.`);
  res.json(db.products[productIndex]);
});

app.listen(PORT, () => {
  console.log(`✨ Servidor backend escuchando en http://localhost:${PORT}`);
});