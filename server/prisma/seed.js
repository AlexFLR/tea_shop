import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('⚙️  Seeding start...');


  console.log('DB:', process.env.DATABASE_URL);


  await prisma.orderItem.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.order.deleteMany({});



  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass  = await bcrypt.hash('user123', 10);

 await prisma.user.upsert({
  where: { email: 'admin@tea.com' },
  update: {},
  create: { email: 'admin@tea.com', password_hash: adminPass, role: 'admin', name: 'Admin Chai' }
});

await prisma.user.upsert({
  where: { email: 'user@tea.com' },
  update: {},
  create: { email: 'user@tea.com', password_hash: userPass, role: 'user', name: 'Tea Lover' }
});



  const [green, black, herbal, matcha] = await Promise.all([
    prisma.category.upsert({ where: { name: 'Green Tea'  }, update: {}, create: { name: 'Green Tea'  }}),
    prisma.category.upsert({ where: { name: 'Black Tea'  }, update: {}, create: { name: 'Black Tea'  }}),
    prisma.category.upsert({ where: { name: 'Herbal Tea' }, update: {}, create: { name: 'Herbal Tea' }}),
    prisma.category.upsert({ where: { name: 'Matcha'     }, update: {}, create: { name: 'Matcha'     }})
  ]);

  const products =[
     { title: 'Sencha Premium',        price_eur: 8.90,  categoryId: green.id,  image_url: 'https://images.unsplash.com/photo-1576092759770-14d9e692eb45?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687' },
      { title: 'Jasmine Pearls',        price_eur: 12.50, categoryId: green.id,  image_url: 'https://images.unsplash.com/photo-1598606687624-52889f76cf9e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687' },
      { title: 'Earl Grey Bergamot',    price_eur: 7.40,  categoryId: black.id,  image_url: 'https://images.unsplash.com/photo-1643583130980-5b3c392bff6b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735' },
      { title: 'Assam Breakfast',       price_eur: 6.80,  categoryId: black.id,  image_url: 'https://images.unsplash.com/photo-1597916374793-3e9faa9fae43?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687' },
      { title: 'Chamomile Blossoms',    price_eur: 5.90,  categoryId: herbal.id, image_url: 'https://images.unsplash.com/photo-1606695846860-4ba8746ff7bf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170' },
      { title: 'Peppermint Leaves',     price_eur: 5.50,  categoryId: herbal.id, image_url: 'https://images.unsplash.com/photo-1622480914645-8fa9b36178a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170' },
      { title: 'Matcha Ceremonial 30g', price_eur: 19.90, categoryId: matcha.id, image_url: 'https://images.unsplash.com/photo-1597406568121-0fb4ab839274?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170' },
      { title: 'English Tea',     price_eur: 2.50,  categoryId: green.id, image_url: 'https://images.unsplash.com/photo-1597066371673-2088a5c19802?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764' },
      { title: 'Royal Leaves',     price_eur: 8.50,  categoryId: black.id, image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687' },
      { title: 'Teacora Tea',     price_eur: 3.50,  categoryId: green.id, image_url: 'https://images.unsplash.com/photo-1597407200853-eaa5683f49d0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171' },
      { title: 'Dilmah Tea',     price_eur: 4.99,  categoryId: matcha.id, image_url: 'https://images.unsplash.com/photo-1708658767790-8029f20906ac?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fHRlYSUyMGJhZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
      { title: 'Mixed Tea Leaves',     price_eur: 1.59,  categoryId: matcha.id, image_url: 'https://images.unsplash.com/photo-1516715043227-1cdf27bcd09a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fHRlYSUyMGJhZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' }
    ];


for (const p of products) {
  try {
    const updated = await prisma.product.upsert({
      where: { title: p.title },         
      update: {
        price_eur: p.price_eur,
        image_url: p.image_url,           
        categoryId: p.categoryId,
      },
      create: p,
    });
    console.log(` Processed: ${updated.title} → ${updated.image_url}`);
  } catch (e) {
    console.error(`Error ${p.title}:`, e.message);
  }
}

const total = await prisma.product.count();
console.log(' total products now =', total);
console.log(' Seed done (upsert).');
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });







