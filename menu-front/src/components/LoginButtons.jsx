import "../styles/LoginButtons.css";

function LoginButtons() {
  return (
    <div className="login-buttons">
      <button type="button" className="auth-btn-login">Iniciar sesión</button>
      <button type="button" className="auth-btn-register">Registrarse</button>
    </div>
  );
}

export default LoginButtons;