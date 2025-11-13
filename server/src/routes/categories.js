import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = Router();

// Public: 
router.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// Admin: 
router.post('/', authRequired, requireRole('admin'), async (req, res) => {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Missing name' });
  const c = await prisma.category.create({ data: { name } });
  res.json(c);
});

// Admin: update
router.put('/:id', authRequired, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body || {};
  const c = await prisma.category.update({ where: { id: Number(id) }, data: { name } });
  res.json(c);
});

// Admin: delete
router.delete('/:id', authRequired, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  await prisma.category.delete({ where: { id: Number(id) } });
  res.json({ ok: true });
});

export default router;
