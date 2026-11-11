import { useState } from 'react';

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth">
      <aside className="auth-brand">
        <div className="logo"><span>UM</span> User Management</div>
        <div>
          <h2>Kelola pengguna dengan rapi dan cepat.</h2>
          <ul>
            <li>Tambah, ubah, dan hapus pengguna</li>
            <li>Atur peran Admin, Editor, dan User</li>
            <li>Cari dan filter dalam sekejap</li>
          </ul>
        </div>
        <p className="muted-light">React · React Router · Vite</p>
      </aside>
      <main className="auth-card">
        <div className="logo logo-mobile"><span>UM</span> User Management</div>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
      </main>
    </div>
  );
}

export function Field({ label, error, children }) {
  return (
    <label className={'field' + (error ? ' has-error' : '')}>
      <span className="field-label">{label}</span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export function PasswordField({ label, error, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} error={error}>
      <span className="pw">
        <input type={show ? 'text' : 'password'} {...props} />
        <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)} aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}>
          {show ? 'Sembunyikan' : 'Lihat'}
        </button>
      </span>
    </Field>
  );
}
