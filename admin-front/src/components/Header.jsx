import './Header.css'

export default function Header({ userRole, onLogout, onChangeRole }) {
  const roleNames = {
    admin: 'Administrador',
    cocinero: 'Cocinero',
    mozo: 'Mozo'
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="logo">🍽️ Restaurant Admin</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="role-badge" title={`Rol actual: ${roleNames[userRole]}`}>
              {roleNames[userRole]}
            </span>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => onChangeRole(userRole === 'admin' ? 'cocinero' : userRole === 'cocinero' ? 'mozo' : 'admin')}
            >
              Cambiar Rol
            </button>
            <button 
              className="btn btn-sm btn-danger"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
