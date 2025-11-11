import { useState } from 'react';
import { saveToken } from '../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');   
  const [password, setPassword] = useState('');  
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const r = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!r.ok) throw new Error('Invalid credentials');
      const data = await r.json();
      saveToken(data.token);
      window.location.href = '/'; 
    } catch (e) {
      setErr(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{maxWidth: 420}}>
      <h1 className="h4 mb-5">Login</h1>
      <form onSubmit={submit} className="d-grid gap-3" autoComplete="off">
        <input className="form-control" placeholder="Email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="form-control" type="password" placeholder="Password"
               value={password} onChange={e=>setPassword(e.target.value)}autoComplete="new-password"/>
        {err && <div className="alert alert-danger py-2 mb-0">{err}</div>}
        <button className="btn btn-dark" disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
