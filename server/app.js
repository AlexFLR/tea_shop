import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import categoriesRoutes from './src/routes/categories.js';
import productsRoutes from './src/routes/products.js';
import cartRoutes from './src/routes/cart.js';
import ordersRoutes from './src/routes/orders.js';
import rateRoutes from './src/routes/rate.js';

// 👉 deocamdată montăm DOAR ruta de auth (ca să nu dea eroare dacă celelalte fișiere nu există încă)
import authRoutes from './src/routes/auth.js';

const app = express();            // <= inițializează app ÎNAINTE de app.use(...)
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true, name: 'MiniShop API' }));

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);


app.use('/api/cart', cartRoutes);
app.use('/api/cart', ordersRoutes);
app.use('/api/rate', rateRoutes);

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
