import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// 🔹 Checkout = finalizează comanda
router.post('/checkout', authRequired, async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true }
  });
  if (items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const total = items.reduce((sum, it) => sum + it.product.price_eur * it.qty, 0);

  const order = await prisma.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: { userId: req.user.id, total_eur: total }
    });
    await tx.orderItem.createMany({
      data: items.map(it => ({
        orderId: o.id,
        productId: it.productId,
        qty: it.qty,
        price_eur_snapshot: it.product.price_eur
      }))
    });
    await tx.cartItem.deleteMany({ where: { userId: req.user.id } });
    return o;
  });

  res.json({ ok: true, order });
});

export default router;
