import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function LoginButtons({ onAction }) {
  const { isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <>
        <Link to="/perfil" className="nav-btn nav-btn--perfil" onClick={onAction}>
          Mi perfil
        </Link>
        <button
          className="nav-btn nav-btn--logout"
          onClick={() => { logout(); onAction?.(); }}
        >
          Cerrar sesión
        </button>
      </>
    );
  }

  return (
    <>
      <Link to="/login" className="nav-btn nav-btn--login" onClick={onAction}>
        Iniciar sesión
      </Link>
      <Link to="/register" className="nav-btn nav-btn--register" onClick={onAction}>
        Registrarse
      </Link>
    </>
  );
}

export default LoginButtons;