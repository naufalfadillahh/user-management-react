import { useState } from 'react';
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { getSession, setSession } from './storage';

function App() {
  const [user, setUser] = useState(getSession);
  const logout = () => { setSession(null); setUser(null); };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginForm onLogin={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterForm />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={logout} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function NotFound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <p>Halaman yang kamu cari tidak ditemukan.</p>
      <Link className="btn btn-primary" to="/">Kembali ke beranda</Link>
    </div>
  );
}

export default App;
