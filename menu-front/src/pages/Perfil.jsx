import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { BASE_URL } from '../config';
import api from '../services/api';
import '../styles/Perfil.css';

function Perfil() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/profile')
      .then(res => setPerfil(res.data))
      .catch(() => setError('No se pudo cargar el perfil.'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="perfil-estado">Cargando perfil...</div>;
  if (error)   return <div className="perfil-estado perfil-error">{error}</div>;

  const iniciales = `${perfil.nombre?.[0] ?? ''}${perfil.apellido?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="perfil-container">
      <div className="perfil-card">

     <button className="perfil-volver-btn" onClick={() => navigate('/')}>
        ← Volver al menú
      </button>
      
        {/* Avatar */}
        <div className="perfil-avatar-wrap">
          {perfil.imageUrl ? (
            <img
              src={`${BASE_URL}${perfil.imageUrl}`}
              alt="Foto de perfil"
              className="perfil-avatar-img"
            />
          ) : (
            <div className="perfil-avatar-placeholder">
              <span className="perfil-iniciales">{iniciales || '?'}</span>
            </div>
          )}
        </div>

        {/* Nombre completo */}
        <h1 className="perfil-nombre">
          {perfil.nombre} {perfil.apellido}
        </h1>
        <span className="perfil-rol">{perfil.rol}</span>

        {/* Datos */}
        <div className="perfil-datos">
          <div className="perfil-dato">
            <span className="perfil-dato-label">Email</span>
            <span className="perfil-dato-valor">{perfil.email}</span>
          </div>
          <div className="perfil-dato">
            <span className="perfil-dato-label">Fecha de nacimiento</span>
            <span className="perfil-dato-valor">
              {perfil.fechaNacimiento
                ? new Date(perfil.fechaNacimiento).toLocaleDateString('es-AR')
                : '—'}
            </span>
          </div>
        </div>

        <button className="perfil-logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Perfil;