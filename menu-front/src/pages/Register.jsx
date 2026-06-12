import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AuthPages.css';
import { useAuth } from '../auth/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: '',
    password: '',
    passwordConfirm: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await signup({ ...formData, imageFile });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al registrarse. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Registrarse</h1>

        <button className="perfil-volver-btn" onClick={() => navigate('/')}>
        ← Volver al menú
      </button>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Tu nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido" className="form-label">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Tu apellido"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm" className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageFile" className="form-label">
              Foto de perfil <span style={{ fontWeight: 'normal', opacity: 0.6 }}>(opcional)</span>
            </label>
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0] ?? null)}
              className="form-input"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="auth-link">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;