import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EMAIL_RE, getUsers, saveUsers } from './storage';
import { AuthShell, Field, PasswordField } from './ui';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: false });
  const [errors, setErrors] = useState({});

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    const users = getUsers();
    if (form.name.trim().length < 2) er.name = 'Nama minimal 2 karakter.';
    if (!EMAIL_RE.test(form.email.trim())) er.email = 'Format email tidak valid.';
    else if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) er.email = 'Email sudah terdaftar.';
    if (form.password.length < 6) er.password = 'Password minimal 6 karakter.';
    if (form.confirm !== form.password) er.confirm = 'Konfirmasi password tidak sama.';
    if (!form.terms) er.terms = 'Setujui syarat dan ketentuan untuk melanjutkan.';
    setErrors(er);
    if (Object.keys(er).length) return;

    const id = users.reduce((m, u) => Math.max(m, u.id), 0) + 1;
    saveUsers([...users, {
      id, name: form.name.trim(), email: form.email.trim(), password: form.password,
      role: 'User', status: 'Aktif', createdAt: new Date().toISOString(),
    }]);
    navigate('/login', { state: { registered: form.email.trim() } });
  };

  return (
    <AuthShell title="Buat akun" subtitle="Daftar untuk mulai mengelola pengguna.">
      <form onSubmit={submit} noValidate>
        <Field label="Nama lengkap" error={errors.name}>
          <input type="text" autoComplete="name" placeholder="Contoh: Budi Santoso" value={form.name} onChange={update('name')} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" autoComplete="email" placeholder="nama@email.com" value={form.email} onChange={update('email')} />
        </Field>
        <PasswordField label="Password" error={errors.password} value={form.password} onChange={update('password')} placeholder="Minimal 6 karakter" autoComplete="new-password" />
        <PasswordField label="Konfirmasi password" error={errors.confirm} value={form.confirm} onChange={update('confirm')} placeholder="Ulangi password" autoComplete="new-password" />
        <label className={'check' + (errors.terms ? ' has-error' : '')}>
          <input type="checkbox" checked={form.terms} onChange={update('terms')} />
          <span>Saya menyetujui syarat dan ketentuan</span>
        </label>
        {errors.terms && <p className="field-error">{errors.terms}</p>}
        <button className="btn btn-primary btn-block" type="submit">Daftar sekarang</button>
      </form>
      <p className="auth-switch">Sudah punya akun? <Link to="/login">Masuk</Link></p>
    </AuthShell>
  );
}
