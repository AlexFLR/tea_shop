import { useEffect, useState } from 'react';
import { getToken } from '../lib/auth';
import { getEurToRon, eur, ron } from '../lib/rate';
import { useCart } from '../context/CartContext.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [rate, setRate]         = useState(null);

  useEffect(() => {
    //  Fetch produse
    fetch('http://localhost:4000/api/products')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));

    //  Fetch curs 
    getEurToRon().then(setRate);
  }, []);
  const { reload } = useCart();
  const addToCart = async (productId) => {
    const token = getToken();
    if (!token) return alert('Te rugăm să te loghezi.');

    const r = await fetch('http://localhost:4000/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId, qty: 1 })
    });
    /* if (!r.ok) return alert('Nu s-a putut adăuga în coș.');
    alert('Adăugat în coș!'); */
    reload();
  };

  if (loading) return <div className="container py-4">Loading…</div>;

  return (
    <div className="container py-5 pb-5">
      <h1 className="h4 mb-4">Our Teas</h1>

     
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 gy-5 gx-5">
        {products.map(p => {
          const priceEur = Number(p.price_eur);
          const priceRon = rate ? priceEur * rate : null;

          return (
            <div className="col" key={p.id}>
              <div className="card h-100 d-flex flex-column shadow-sm">
                
                {p.image_url && (
                  <div className="ratio ratio-16x9">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="card-img-top"
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  <h2 className="h6 card-title mb-3">{p.title}</h2>

                  
                  <div className="text-muted mb-2">{eur(priceEur)}</div>
                  {priceRon != null && (
                    <div className="fw-semibold text-success small mb-2"> {ron(priceRon)}</div>
                  )}

                  
                  <button
                    className="btn btn-dark mt-auto"
                    onClick={() => addToCart(p.id)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}

       
        {products.length === 0 && (
          <div className="col-12 text-center text-muted">Nu există produse.</div>
        )}
      </div>
    </div>
  );
}
