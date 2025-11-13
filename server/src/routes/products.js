import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = Router();

// Public:
router.get('/', async (req, res) => {
  const { categoryId } = req.query;
  const where = categoryId ? { categoryId: Number(categoryId) } : {};
  const products = await prisma.product.findMany({ where, include: { category: true } });
  res.json(products);
});

// Public: 
router.get('/:id', async (req, res) => {
  const p = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// Admin: create
router.post('/', authRequired, requireRole('admin'), async (req, res) => {
  const { title, price_eur, categoryId } = req.body || {};
  if (!title || price_eur == null || !categoryId) return res.status(400).json({ error: 'Missing fields' });
  const p = await prisma.product.create({ data: { title, price_eur: Number(price_eur), categoryId: Number(categoryId) } });
  res.json(p);
});

// Admin: update
router.put('/:id', authRequired, requireRole('admin'), async (req, res) => {
  const { title, price_eur, categoryId } = req.body || {};
  const p = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: { title, price_eur: Number(price_eur), categoryId: Number(categoryId) }
  });
  res.json(p);
});

// Admin: delete
router.delete('/:id', authRequired, requireRole('admin'), async (req, res) => {
  await prisma.product.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default router;
