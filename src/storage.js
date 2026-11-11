// Penyimpanan sederhana berbasis localStorage (pengganti database untuk demo).
const USERS_KEY = 'um-users';
const SESSION_KEY = 'um-session';

const SEED = [
  { id: 1, name: 'Admin Demo', email: 'admin@demo.com', password: 'admin123', role: 'Admin', status: 'Aktif', createdAt: '2026-01-05T09:00:00' },
  { id: 2, name: 'Rizky Pratama', email: 'rizky@demo.com', password: 'rizky123', role: 'Editor', status: 'Aktif', createdAt: '2026-02-11T10:20:00' },
  { id: 3, name: 'Siti Nurhaliza', email: 'siti@demo.com', password: 'siti1234', role: 'User', status: 'Aktif', createdAt: '2026-03-02T14:05:00' },
  { id: 4, name: 'Andi Wijaya', email: 'andi@demo.com', password: 'andi1234', role: 'User', status: 'Nonaktif', createdAt: '2026-03-18T08:45:00' },
  { id: 5, name: 'Dewi Lestari', email: 'dewi@demo.com', password: 'dewi1234', role: 'Editor', status: 'Aktif', createdAt: '2026-04-09T16:30:00' },
];

let memory = null;

function read(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage penuh / diblokir */ }
}

export function getUsers() {
  const stored = read(USERS_KEY);
  if (Array.isArray(stored)) return stored;
  if (!memory) memory = SEED.map((u) => ({ ...u }));
  return memory;
}

export function saveUsers(users) {
  memory = users;
  write(USERS_KEY, users);
}

export function resetUsers() {
  memory = SEED.map((u) => ({ ...u }));
  write(USERS_KEY, memory);
  return memory;
}

export function getSession() {
  const s = read(SESSION_KEY);
  if (!s) return null;
  return getUsers().find((u) => u.id === s.id) || null;
}

export function setSession(user) {
  if (user) write(SESSION_KEY, { id: user.id });
  else { try { localStorage.removeItem(SESSION_KEY); } catch { /* abaikan */ } }
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}
