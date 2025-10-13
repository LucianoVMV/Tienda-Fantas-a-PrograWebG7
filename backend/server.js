import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 5001; // Usaremos el puerto 5001 para evitar conflictos

// La ruta a la base de datos. Es relativa a la carpeta 'backend'.
const DB_PATH = path.resolve(process.cwd(), 'data/db.json');

app.use(cors());
app.use(express.json());

// --- Lógica de Base de Datos en Archivo JSON ---
let db = { products: [], categories: [] };
let nextProductId = 1;
let nextCategoryId = 1;

async function loadDatabase() {
  try {
    const dbContent = await fs.readFile(DB_PATH, 'utf-8');
    if (dbContent.trim() === '') {
        db = { products: [], categories: [] };
    } else {
        db = JSON.parse(dbContent);
    }
    
    // Asegurarnos de que las listas existan
    if (!db.products) db.products = [];
    if (!db.categories) db.categories = [];

    // Calculamos los siguientes IDs
    if (db.products.length > 0) {
      nextProductId = Math.max(...db.products.map(p => p.id)) + 1;
    }
    if (db.categories.length > 0) {
      nextCategoryId = Math.max(...db.categories.map(c => c.id)) + 1;
    }
    console.log('✅ Base de datos cargada correctamente desde db.json');
  } catch (err) {
    if (err.code === 'ENOENT') {
        db = { products: [], categories: [] };
        await saveDatabase();
        console.log('✅ Archivo db.json no encontrado, se ha creado uno nuevo.');
    } else {
        console.error('❌ Error fatal al cargar la base de datos:', err);
        // Si hay un error de parseo, el servidor no debe iniciar
        process.exit(1); 
    }
  }
}

async function saveDatabase() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('❌ Error al guardar la base de datos:', err);
  }
}

// --- Rutas de la API ---
// Se definen después de que la base de datos esté lista
loadDatabase().then(() => {
    // GET público para productos (solo los activos)
    app.get('/api/products', (req, res) => {
        const activeProducts = db.products.filter(p => p.isActive !== false);
        res.json(activeProducts);
    });

    // GET de admin para productos (todos)
    app.get('/api/admin/products', (req, res) => {
        res.json(db.products);
    });

    // POST para crear un producto
    app.post('/api/products', async (req, res) => {
        const { name, category, price, description, image } = req.body;
        const newProduct = {
            id: nextProductId++,
            name, category, price: parseFloat(price), description, image,
            isActive: true
        };
        db.products.push(newProduct);
        await saveDatabase();
        res.status(201).json(newProduct);
    });

    // PUT para actualizar un producto
    app.put('/api/products/:id', async (req, res) => {
        const productIndex = db.products.findIndex(p => p.id === parseInt(req.params.id));
        if (productIndex === -1) return res.status(404).send();
        db.products[productIndex] = { ...db.products[productIndex], ...req.body, price: parseFloat(req.body.price) };
        await saveDatabase();
        res.json(db.products[productIndex]);
    });

    // DELETE para desactivar/activar un producto
    app.delete('/api/products/:id', async (req, res) => {
        const productIndex = db.products.findIndex(p => p.id === parseInt(req.params.id));
        if (productIndex === -1) return res.status(404).send();
        db.products[productIndex].isActive = !db.products[productIndex].isActive;
        await saveDatabase();
        res.status(204).send();
    });

    // --- Rutas para Categorías ---
    app.get('/api/categories', (req, res) => res.json(db.categories));

    app.post('/api/categories', async (req, res) => {
        const { name, description } = req.body;
        const newCategory = { id: nextCategoryId++, name, description };
        db.categories.push(newCategory);
        await saveDatabase();
        res.status(201).json(newCategory);
    });
    
    app.put('/api/categories/:id', async (req, res) => {
        const catIndex = db.categories.findIndex(c => c.id === parseInt(req.params.id));
        if (catIndex === -1) return res.status(404).send();
        db.categories[catIndex] = { ...db.categories[catIndex], ...req.body };
        await saveDatabase();
        res.json(db.categories[catIndex]);
    });

    app.delete('/api/categories/:id', async (req, res) => {
        db.categories = db.categories.filter(c => c.id !== parseInt(req.params.id));
        // Opcional: Desvincular productos de esta categoría
        db.products.forEach(p => {
            if (p.category === req.params.categoryName) { // Asumiendo que se pasa el nombre
                p.category = 'Sin Categoría';
            }
        });
        await saveDatabase();
        res.status(204).send();
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`✨ Servidor backend escuchando en http://localhost:${PORT}`);
    });
});