import { useMemo, useState } from 'react';
import { EMAIL_RE, getUsers, initials, resetUsers, saveUsers } from './storage';

const ROLES = ['Admin', 'Editor', 'User'];
const EMPTY = { name: '', email: '', password: '', role: 'User', status: 'Aktif' };

function fmt(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Dashboard({ user, onLogout }) {
  const [users, setUsers] = useState(getUsers);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('Semua');
  const [modal, setModal] = useState(null); // {mode:'add'|'edit', data}
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');
  const isAdmin = user.role === 'Admin';

  const commit = (next, msg) => { setUsers(next); saveUsers(next); setToast(msg); setTimeout(() => setToast(''), 2200); };

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    return users
      .filter((u) => (role === 'Semua' || u.role === role) && (!k || (u.name + ' ' + u.email).toLowerCase().includes(k)))
      .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  }, [users, q, role]);

  const stats = [
    { label: 'Total pengguna', value: users.length },
    { label: 'Aktif', value: users.filter((u) => u.status === 'Aktif').length },
    { label: 'Admin', value: users.filter((u) => u.role === 'Admin').length },
    { label: 'Bergabung 30 hari terakhir', value: users.filter((u) => Date.now() - new Date(u.createdAt) < 30 * 864e5).length },
  ];

  const openAdd = () => { setErrors({}); setModal({ mode: 'add', data: { ...EMPTY } }); };
  const openEdit = (u) => { setErrors({}); setModal({ mode: 'edit', data: { ...u, password: '' } }); };

  const save = (e) => {
    e.preventDefault();
    const d = modal.data;
    const er = {};
    if (d.name.trim().length < 2) er.name = 'Nama minimal 2 karakter.';
    if (!EMAIL_RE.test(d.email.trim())) er.email = 'Format email tidak valid.';
    else if (users.some((u) => u.email.toLowerCase() === d.email.trim().toLowerCase() && u.id !== d.id)) er.email = 'Email sudah dipakai pengguna lain.';
    if (modal.mode === 'add' && d.password.length < 6) er.password = 'Password minimal 6 karakter.';
    if (modal.mode === 'edit' && d.password && d.password.length < 6) er.password = 'Password minimal 6 karakter.';
    if (d.id === user.id && (d.role !== 'Admin' || d.status !== 'Aktif') && isAdmin) er.role = 'Kamu tidak bisa menurunkan peran atau menonaktifkan akunmu sendiri.';
    setErrors(er);
    if (Object.keys(er).length) return;
    const clean = { name: d.name.trim(), email: d.email.trim(), role: d.role, status: d.status };
    if (modal.mode === 'add') {
      const id = users.reduce((m, u) => Math.max(m, u.id), 0) + 1;
      commit([...users, { id, ...clean, password: d.password, createdAt: new Date().toISOString() }], 'Pengguna ditambahkan');
    } else {
      commit(users.map((u) => (u.id === d.id ? { ...u, ...clean, ...(d.password ? { password: d.password } : {}) } : u)), 'Perubahan disimpan');
    }
    setModal(null);
  };

  const remove = (u) => {
    if (u.id === user.id) return;
    if (!window.confirm(`Hapus pengguna ${u.name}?`)) return;
    commit(users.filter((x) => x.id !== u.id), 'Pengguna dihapus');
  };

  const set = (k) => (e) => { const v = e.target.value; setModal((m) => ({ ...m, data: { ...m.data, [k]: v } })); setErrors((er) => ({ ...er, [k]: undefined })); };

  return (
    <div className="dash">
      <header className="topbar">
        <div className="logo"><span>UM</span> User Management</div>
        <div className="me">
          <span className="avatar">{initials(user.name)}</span>
          <span className="me-text"><b>{user.name}</b><small>{user.role}</small></span>
          <button className="btn btn-ghost" onClick={onLogout}>Keluar</button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-head">
          <div>
            <h1>Pengguna</h1>
            <p className="muted">Kelola akun, peran, dan status pengguna.</p>
          </div>
          {isAdmin && <button className="btn btn-primary" onClick={openAdd}>+ Tambah pengguna</button>}
        </div>

        <section className="stats">
          {stats.map((s) => (<div className="stat" key={s.label}><b>{s.value}</b><span>{s.label}</span></div>))}
        </section>

        <section className="card">
          <div className="toolbar">
            <input className="search" type="search" placeholder="Cari nama atau email…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari pengguna" />
            <div className="chips" role="group" aria-label="Filter peran">
              {['Semua', ...ROLES].map((r) => (
                <button key={r} className={'chip' + (role === r ? ' on' : '')} onClick={() => setRole(r)} aria-pressed={role === r}>{r}</button>
              ))}
            </div>
          </div>

          {list.length === 0 ? (
            <p className="empty">Tidak ada pengguna yang cocok.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Pengguna</th><th>Peran</th><th>Status</th><th>Bergabung</th>{isAdmin && <th className="right">Aksi</th>}</tr></thead>
                <tbody>
                  {list.map((u) => (
                    <tr key={u.id}>
                      <td><div className="person"><span className="avatar sm">{initials(u.name)}</span><div><b>{u.name}{u.id === user.id && <em className="you">kamu</em>}</b><small>{u.email}</small></div></div></td>
                      <td><span className={'badge role-' + u.role.toLowerCase()}>{u.role}</span></td>
                      <td><span className={'status ' + (u.status === 'Aktif' ? 'ok' : 'off')}>{u.status}</span></td>
                      <td className="muted">{fmt(u.createdAt)}</td>
                      {isAdmin && (
                        <td className="right actions">
                          <button className="btn btn-sm" onClick={() => openEdit(u)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => remove(u)} disabled={u.id === user.id} title={u.id === user.id ? 'Tidak bisa menghapus akun sendiri' : ''}>Hapus</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {!isAdmin && <p className="note">Kamu masuk sebagai {user.role}. Hanya Admin yang bisa menambah, mengubah, atau menghapus pengguna.</p>}
        <p className="note">Data demo disimpan di browser kamu. <button className="link" onClick={() => commit(resetUsers(), 'Data demo dipulihkan')}>Pulihkan data demo</button></p>
      </main>

      {modal && (
        <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <form className="modal" onSubmit={save} noValidate>
            <h2>{modal.mode === 'add' ? 'Tambah pengguna' : 'Edit pengguna'}</h2>
            <label className={'field' + (errors.name ? ' has-error' : '')}><span className="field-label">Nama</span><input value={modal.data.name} onChange={set('name')} autoFocus />{errors.name && <span className="field-error">{errors.name}</span>}</label>
            <label className={'field' + (errors.email ? ' has-error' : '')}><span className="field-label">Email</span><input type="email" value={modal.data.email} onChange={set('email')} />{errors.email && <span className="field-error">{errors.email}</span>}</label>
            <label className={'field' + (errors.password ? ' has-error' : '')}><span className="field-label">{modal.mode === 'add' ? 'Password' : 'Password baru (opsional)'}</span><input type="password" value={modal.data.password} onChange={set('password')} placeholder={modal.mode === 'add' ? 'Minimal 6 karakter' : 'Kosongkan jika tidak diubah'} />{errors.password && <span className="field-error">{errors.password}</span>}</label>
            <div className="row2">
              <label className="field"><span className="field-label">Peran</span><select value={modal.data.role} onChange={set('role')}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></label>
              <label className="field"><span className="field-label">Status</span><select value={modal.data.status} onChange={set('status')}><option>Aktif</option><option>Nonaktif</option></select></label>
            </div>
            {errors.role && <p className="field-error">{errors.role}</p>}
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setModal(null)}>Batal</button>
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
