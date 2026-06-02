import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AuthPages.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Conectar con el backend
    console.log('Login:', { email, password });
    // navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Iniciar Sesión</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="auth-btn">
            Iniciar Sesión
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta? 
          <Link to="/register" className="auth-link">Registrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
