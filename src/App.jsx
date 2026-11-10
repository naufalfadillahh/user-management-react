import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

function Registration() {
  return (
    <div className='form-container'>
      <h1>Registration Form</h1>
      <form>
        <input type="text" placeholder=' Enter your name ' required/>
        <input type="email" placeholder=' Enter your email ' required/>
        <input type="password" placeholder=' Create your password ' required/>
        <input type="password" placeholder=' Confirm your password ' required/>
        <div className='checkbox-container'>
          <input type="checkbox" id="terms" required/>
          <label htmlFor="terms">I accept all terms and conditions</label>
        </div>
        <button className="btn" type="submit">Register Now</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login now</Link>
      </p>
    </div>
  );
}

function Login() {
  return (
    <div className='form-container'>
      <h1>Login Form</h1>
      <form>
        <input type="email" placeholder=' Enter your email ' required/>
        <input type="password" placeholder=' Enter your password ' required/>
        <button className='btn' type="submit">Login Now</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  )
}

export default App;