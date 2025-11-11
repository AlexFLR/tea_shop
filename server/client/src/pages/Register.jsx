import { useMemo, useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validări minime pe client
  const errors = useMemo(() => {
    const out = {};
    if (!form.name.trim()) out.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) out.email = 'Invalid email';
    if (form.password.length < 6) out.password = 'Min 6 characters';
    if (form.confirm !== form.password) out.confirm = 'Passwords do not match';
    return out;
  }, [form]);

  const canSubmit = !loading && Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!canSubmit) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Account created successfully!');
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h2 className="mb-4 text-center">Create Account</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Dezactivează autocomplete la nivel de formular */}
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="name"        /* corect pentru browser */
          />
          
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"       /* NU 'off' – Chrome preferă 'email' */
          />
          
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            autoComplete="new-password" /* recomandat pentru register */
          />
         
        </div>

        <div className="mb-4">
          <label className="form-label">Confirm password</label>
          <input
            type="password"
            name="confirm"
            className={`form-control ${errors.confirm ? 'is-invalid' : ''}`}
            required
            value={form.confirm}
            onChange={handleChange}
            placeholder="Retype your password"
            autoComplete="new-password"
          />
          
        </div>

        <button className="btn btn-dark w-100" type="submit" disabled={!canSubmit}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-3 text-center">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}
