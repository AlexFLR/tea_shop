import { useEffect, useState } from 'react';
import { getToken } from '../lib/auth';
import { useCart } from '../context/CartContext.jsx'; // ✅ new
import { getEurToRon, eur, ron } from '../lib/rate';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [rate, setRate]   = useState(null);
  const [currency, setCurrency] = useState('EUR');
  const { reload } = useCart(); // ✅ access reload from context
  const token = getToken();

  const load = async () => {
    const r = await fetch('http://localhost:4000/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await r.json();
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (!token) return;
    load();
    getEurToRon().then(setRate);
  }, [token]);

  const removeItem = async (itemId) => {
    await fetch(`http://localhost:4000/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    await load();
    reload(); // ✅ update navbar count
  };

  const clearCart = async () => {
    await fetch('http://localhost:4000/api/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    await load();
    reload(); // ✅ update navbar count
  };

  const checkout = async () => {
    const r = await fetch('http://localhost:4000/api/cart/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!r.ok) return alert('Checkout failed');
    alert('Order placed!');
    await load();
    reload(); // ✅ update navbar count
  };

  // --- calcule + formatare în funcție de monedă ---
  const lineInSelected = (eurValue) => {
    if (currency === 'EUR') return eur(eurValue);
    if (rate) return ron(eurValue * rate);
    // fallback dacă nu avem încă rate
    return '—';
  };

  const totalEur = items.reduce((s, it) => s + it.product.price_eur * it.qty, 0);
  const totalLabel =
    currency === 'EUR'
      ? eur(totalEur)
      : rate
        ? ron(totalEur * rate)
        : '—';

  if (!token) return (
    <div className="container py-5">
      <div className="alert alert-warning">Trebuie să te loghezi pentru a vedea coșul.</div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 m-0">Cart</h1>

        <div className="d-flex align-items-center gap-4">
      
          <div className="btn-group" role="group" aria-label="Currency toggle">
            <button
              type="button"
              className={`btn btn-sm ${currency === 'EUR' ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => setCurrency('EUR')}
            >
              EUR
            </button>
            <button
              type="button"
              className={`btn btn-sm ${currency === 'RON' ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => setCurrency('RON')}
              disabled={!rate} 
              title={!rate ? 'Așteaptă cursul EUR→RON' : ''}
            >
              RON
            </button>
          </div>

          {items.length > 0 && (
            <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
              Clear cart
            </button>
          )}
        </div>
      </div>

      {items.length === 0 && <div className="alert alert-light">Coșul este gol.</div>}

      <div className="vstack gap-2">
        {items.map(it => {
          const lineEur = it.product.price_eur * it.qty;
          return (
            <div key={it.id} className="border rounded p-3 d-flex justify-content-between align-items-center">
              <div className="me-3">{it.product.title}</div>
              <div className="text-muted">x{it.qty}</div>
              <div className="fw-semibold">{lineInSelected(lineEur)}</div>
              <button
                className="btn btn-outline-secondary btn-sm ms-3"
                onClick={() => removeItem(it.id)}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="fw-bold">Total: {totalLabel}</div>
          <button className="btn btn-success" onClick={checkout}>Checkout</button>
        </div>
      )}
    </div>
  );
}
