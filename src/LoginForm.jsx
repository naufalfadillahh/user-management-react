import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { EMAIL_RE, getUsers, setSession } from './storage';
import { AuthShell, Field, PasswordField } from './ui';

export default function LoginForm({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const registered = location.state?.registered;
  const [email, setEmail] = useState(registered || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim()) || !password) { setError('Isi email dan password dengan benar.'); return; }
    const user = getUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) { setError('Email atau password salah.'); return; }
    if (user.status !== 'Aktif') { setError('Akun ini sedang dinonaktifkan oleh admin.'); return; }
    setSession(user);
    onLogin(user);
    navigate('/dashboard', { replace: true });
  };

  const fillDemo = () => { setEmail('admin@demo.com'); setPassword('admin123'); setError(''); };

  return (
    <AuthShell title="Selamat datang kembali" subtitle="Masuk untuk membuka dashboard pengguna.">
      {registered && <div className="alert alert-success">Akun berhasil dibuat. Silakan masuk.</div>}
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <form onSubmit={submit} noValidate>
        <Field label="Email">
          <input type="email" autoComplete="email" placeholder="nama@email.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
        </Field>
        <PasswordField label="Password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Password kamu" autoComplete="current-password" />
        <button className="btn btn-primary btn-block" type="submit">Masuk</button>
      </form>
      <button type="button" className="demo-hint" onClick={fillDemo}>
        <span>Coba akun demo</span> admin@demo.com · admin123
      </button>
      <p className="auth-switch">Belum punya akun? <Link to="/register">Daftar di sini</Link></p>
    </AuthShell>
  );
}
