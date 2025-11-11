import { Link } from 'react-router-dom';
import { isLoggedIn, clearToken } from '../lib/auth';
import { useCart } from '../context/CartContext.jsx';
import { FaShoppingCart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import logo from '../assets/monk_logo.jpg'; 

export default function Navbar() {
  const logout = () => { clearToken(); window.location.href = '/'; };
  const { count } = useCart();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(t);
    }
  }, [count]);

  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm">
      <div className="container">

        
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-3" to="/">
          <img
            src={logo}
            alt="Chai MONK Logo"
            width="120"
            height="70"
            className="d-inline-block align-text-top"
            style={{ objectFit: 'cover',
                    borderRadius: '50%'
             }}
          />
          <span>Monk's Chai</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto gap-2 align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item position-relative">
              <Link className="nav-link d-flex align-items-center" to="/cart">
                <FaShoppingCart size={18} className="me-1" />
                Cart
                {count > 0 && (
                  <span
                    className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${
                      animate ? 'badge-pulse' : ''
                    }`}
                    style={{ fontSize: '0.6rem' }}
                  >
                    {count}
                  </span>
                )}
              </Link>
            </li>

            {isLoggedIn() ? (
                <li className="nav-item">
                <button className="btn btn-outline-dark btn-sm" onClick={logout}>
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
