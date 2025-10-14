import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 5001;
const DB_PATH = path.resolve(process.cwd(), 'data/db.json');

app.use(cors());
app.use(express.json());


let db = { products: [], categories: [], users: [], orders: [] };
let nextProductId = 1, nextCategoryId = 1, nextUserId = 1, nextOrderId = 1;

async function loadDatabase() {
  try {
    const dbContent = await fs.readFile(DB_PATH, 'utf-8');
    db = JSON.parse(dbContent);
    if (!db.products) db.products = [];
    if (!db.categories) db.categories = [];
    if (!db.users) db.users = [];
    if (!db.orders) db.orders = [];
    if (db.products.length > 0) nextProductId = Math.max(...db.products.map(p => p.id)) + 1;
    if (db.categories.length > 0) nextCategoryId = Math.max(...db.categories.map(c => c.id)) + 1;
    if (db.users.length > 0) nextUserId = Math.max(...db.users.map(u => u.id)) + 1;
    if (db.orders.length > 0) nextOrderId = Math.max(...db.orders.map(o => o.id)) + 1;
    console.log(' Base de datos completa cargada.');
  } catch (err) {
    db = { products: [], categories: [], users: [], orders: [] };
    await saveDatabase();
    console.log(' Archivo db.json no encontrado/vacío, se ha creado uno nuevo.');
  }
}

async function saveDatabase() {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error(' Error al guardar la base de datos:', err);
  }
}

loadDatabase();




app.get('/api/products', (req, res) => res.json(db.products.filter(p => p.isActive !== false)));
app.get('/api/admin/products', (req, res) => res.json(db.products));
app.post('/api/products', async (req, res) => {
    const { name, category, price, description, image } = req.body;
    const newProduct = { id: nextProductId++, name, category, price: parseFloat(price), description, image, isActive: true };
    db.products.push(newProduct);
    await saveDatabase();
    res.status(201).json(newProduct);
});
app.put('/api/products/:id', async (req, res) => {
    const productIndex = db.products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).send();
    const price = req.body.price ? parseFloat(req.body.price) : db.products[productIndex].price;
    db.products[productIndex] = { ...db.products[productIndex], ...req.body, price };
    await saveDatabase();
    res.json(db.products[productIndex]);
});
app.delete('/api/products/:id', async (req, res) => {
    const productIndex = db.products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).send();
    db.products[productIndex].isActive = !db.products[productIndex].isActive;
    await saveDatabase();
    res.json(db.products[productIndex]);
});


app.get('/api/categories', (req, res) => res.json(db.categories));



app.get('/api/admin/users', (req, res) => res.json(db.users));
app.put('/api/admin/users/:id/toggle', async (req, res) => {
    const userIndex = db.users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex !== -1) {
        db.users[userIndex].activo = !db.users[userIndex].activo;
        await saveDatabase();
        res.json(db.users[userIndex]);
    } else {
        res.status(404).send();
    }
});


app.get('/api/admin/orders', (req, res) => res.json(db.orders));


app.get('/api/admin/summary', (req, res) => {
  const { from, to } = req.query;
  let ordersToSummarize = db.orders || [];
  let usersToSummarize = db.users || [];

  
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const day = String(today.getDate()).padStart(2, '0');
  const todayString = `${year}-${month}-${day}`;
 

  if (from && to) {
    ordersToSummarize = ordersToSummarize.filter(order => order.fecha >= from && order.fecha <= to);
    usersToSummarize = [];
  } else {
    
    ordersToSummarize = ordersToSummarize.filter(order => order.fecha === todayString);
  }

  const summary = {
    totalOrders: ordersToSummarize.length,
    newUsers: (from || to) ? 'N/A' : usersToSummarize.length,
    totalRevenue: ordersToSummarize.reduce((sum, order) => sum + order.total, 0),
  };
  res.json(summary);
});

app.listen(PORT, () => {
  console.log(` Servidor backend escuchando en http://localhost:${PORT}`);
});