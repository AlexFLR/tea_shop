import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// GET /api/cart  
router.get('/', authRequired, async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true },
    orderBy: { id: 'asc' },
  });
  res.json(items);
});

// POST /api/cart  
router.post('/', authRequired, async (req, res) => {
  let { productId, qty } = req.body || {};
  productId = Number(productId);
  qty = Number(qty || 1);
  if (!productId || !qty) return res.status(400).json({ error: 'Missing productId or qty' });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = await prisma.cartItem.findFirst({
    where: { userId: req.user.id, productId }
  });

  const item = existing
    ? await prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + qty }
      })
    : await prisma.cartItem.create({
        data: { userId: req.user.id, productId, qty }
      });

  res.json(item);
});

// PUT /api/cart/:itemId 
router.put('/:itemId', authRequired, async (req, res) => {
  const itemId = Number(req.params.itemId);
  const qty = Number(req.body?.qty);
  if (!itemId || !qty) return res.status(400).json({ error: 'Missing itemId or qty' });

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: { qty }
  });
  res.json(updated);
});

// DELETE /api/cart/:itemId 
router.delete('/:itemId', authRequired, async (req, res) => {
  const itemId = Number(req.params.itemId);
  await prisma.cartItem.delete({ where: { id: itemId } });
  res.json({ ok: true });
});

// DELETE /api/cart 
router.delete('/', authRequired, async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ ok: true });
});

export default router;
