import "../styles/LoginButtons.css";
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';


function LoginButtons() {
  const { isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <>
        <Link to="/perfil" className="nav-btn nav-btn--perfil">Mi perfil</Link>
        <button className="nav-btn nav-btn--logout" onClick={logout}>Cerrar sesión</button>
      </>      
    );
  }

  return (
    <>
      <Link to="/login" className="nav-btn nav-btn--login">Iniciar sesión</Link>
      <Link to="/register" className="nav-btn nav-btn--register">Registrarse</Link>
    </>
  );
}

export default LoginButtons;