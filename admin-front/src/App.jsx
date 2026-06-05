import { useState } from 'react'
import Header from './components/Header'
import AdminPage from './pages/AdminPage'
import KitchenPage from './pages/KitchenPage'
import WaiterPage from './pages/WaiterPage'
import './App.css'

function App() {
  // TODO: Reemplazar con tu sistema de auth
  const [userRole, setUserRole] = useState('admin') // 'admin', 'cocinero', 'mozo'
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const handleLogout = () => {
    setIsLoggedIn(false)
    // TODO: Implementar logout real con tu auth
  }

  const handleLogin = (role) => {
    setUserRole(role)
    setIsLoggedIn(true)
    // TODO: Implementar login real con tu auth
  }

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Restaurant Admin</h1>
          <p>Selecciona tu rol para continuar:</p>
          <div className="role-buttons">
            <button onClick={() => handleLogin('admin')} className="btn btn-primary">
              Admin
            </button>
            <button onClick={() => handleLogin('cocinero')} className="btn btn-secondary">
              Cocinero
            </button>
            <button onClick={() => handleLogin('mozo')} className="btn btn-tertiary">
              Mozo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header userRole={userRole} onLogout={handleLogout} onChangeRole={handleLogin} />
      <main className="main-content">
        {userRole === 'admin' && <AdminPage />}
        {userRole === 'cocinero' && <KitchenPage />}
        {userRole === 'mozo' && <WaiterPage />}
      </main>
    </div>
  )
}

export default App
