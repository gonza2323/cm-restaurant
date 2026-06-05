import { useState } from 'react'
import './AdminPage.css'

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState('usuarios')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(null)

  const openModal = (type) => {
    setModalType(type)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType(null)
  }

  return (
    <div className="admin-page">
      <h1>Panel de Administración</h1>

      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab-button ${currentTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setCurrentTab('usuarios')}
        >
          👥 Usuarios
        </button>
        <button
          className={`tab-button ${currentTab === 'carta' ? 'active' : ''}`}
          onClick={() => setCurrentTab('carta')}
        >
          🍴 Carta
        </button>
        <button
          className={`tab-button ${currentTab === 'mesas' ? 'active' : ''}`}
          onClick={() => setCurrentTab('mesas')}
        >
          🪑 Mesas
        </button>
        <button
          className={`tab-button ${currentTab === 'horarios' ? 'active' : ''}`}
          onClick={() => setCurrentTab('horarios')}
        >
          ⏰ Horarios
        </button>
        <button
          className={`tab-button ${currentTab === 'stock' ? 'active' : ''}`}
          onClick={() => setCurrentTab('stock')}
        >
          📦 Stock
        </button>
        <button
          className={`tab-button ${currentTab === 'facturas' ? 'active' : ''}`}
          onClick={() => setCurrentTab('facturas')}
        >
          📄 Facturas
        </button>
      </div>

      {/* Usuarios Tab */}
      {currentTab === 'usuarios' && (
        <div className="tab-content">
          <div className="content-header">
            <h2>Gestión de Usuarios</h2>
            <button className="btn btn-primary" onClick={() => openModal('usuario')}>
              + Nuevo Usuario
            </button>
          </div>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Juan Pérez</td>
                  <td>juan@restaurant.com</td>
                  <td><span className="badge badge-admin">Admin</span></td>
                  <td><span className="badge badge-success">Activo</span></td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-secondary">Editar</button>
                      <button className="btn btn-sm btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>María García</td>
                  <td>maria@restaurant.com</td>
                  <td><span className="badge badge-cocinero">Cocinero</span></td>
                  <td><span className="badge badge-success">Activo</span></td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-secondary">Editar</button>
                      <button className="btn btn-sm btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Carta Tab */}
      {currentTab === 'carta' && (
        <div className="tab-content">
          <div className="content-header">
            <h2>Gestión de Carta</h2>
            <button className="btn btn-primary" onClick={() => openModal('plato')}>
              + Nuevo Plato
            </button>
          </div>
          <div className="card">
            <div className="categories-tabs">
              <button className="category-btn active">Entradas</button>
              <button className="category-btn">Platos Principales</button>
              <button className="category-btn">Postres</button>
              <button className="category-btn">Bebidas</button>
            </div>
            <div className="grid grid-3">
              <div className="menu-item">
                <div className="item-image" style={{ backgroundColor: '#f0f0f0' }}>
                  📷
                </div>
                <h3>Tabla de Quesos</h3>
                <p className="description">Tabla de quesos variados</p>
                <div className="item-footer">
                  <span className="price">$250</span>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-secondary">Editar</button>
                    <button className="btn btn-sm btn-danger">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mesas Tab */}
      {currentTab === 'mesas' && (
        <div className="tab-content">
          <div className="content-header">
            <h2>Gestión de Mesas</h2>
            <button className="btn btn-primary" onClick={() => openModal('mesa')}>
              + Nueva Mesa
            </button>
          </div>
          <div className="card">
            <div className="grid grid-4">
              <div className="mesa-item">
                <div className="mesa-number">1</div>
                <div className="mesa-status">Libre</div>
                <button className="btn btn-sm btn-secondary">Editar</button>
              </div>
              <div className="mesa-item">
                <div className="mesa-number">2</div>
                <div className="mesa-status ocupada">Ocupada</div>
                <button className="btn btn-sm btn-secondary">Editar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Horarios Tab */}
      {currentTab === 'horarios' && (
        <div className="tab-content">
          <div className="content-header">
            <h2>Gestión de Horarios</h2>
            <button className="btn btn-primary" onClick={() => openModal('horario')}>
              + Nuevo Horario
            </button>
          </div>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Día</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Juan Pérez</td>
                  <td>Lunes</td>
                  <td>09:00</td>
                  <td>17:00</td>
                  <td><span className="badge badge-success">Confirmado</span></td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-secondary">Editar</button>
                      <button className="btn btn-sm btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Tab */}
      {currentTab === 'stock' && (
        <div className="tab-content">
          <div className="content-header">
            <h2>Gestión de Stock</h2>
            <button className="btn btn-primary" onClick={() => openModal('stock')}>
              + Nuevo Producto
            </button>
          </div>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Precio</th>
                  <th>Estado Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Botella Gaseosa Cola 1L</td>
                  <td>15</td>
                  <td>Botella</td>
                  <td>$50</td>
                  <td><span className="badge badge-success">Disponible</span></td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-secondary">Editar</button>
                      <button className="btn btn-sm btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Facturas Tab */}
      {currentTab === 'facturas' && (
        <div className="tab-content">
          <div className="content-header">
            <h2>Gestión de Facturas</h2>
            <button className="btn btn-primary" onClick={() => openModal('factura')}>
              + Nueva Factura
            </button>
          </div>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Método Pago</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>001</td>
                  <td>Consumidor Final</td>
                  <td>$500.00</td>
                  <td>Efectivo</td>
                  <td>01/06/2026</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-secondary">Ver</button>
                      <button className="btn btn-sm btn-info">Descargar</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {modalType === 'usuario' && 'Crear Usuario'}
                {modalType === 'plato' && 'Crear Plato'}
                {modalType === 'mesa' && 'Crear Mesa'}
                {modalType === 'horario' && 'Crear Horario'}
                {modalType === 'stock' && 'Crear Producto'}
                {modalType === 'factura' && 'Crear Factura'}
              </h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              {modalType === 'usuario' && (
                <form>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" placeholder="Nombre completo" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="email@restaurant.com" />
                  </div>
                  <div className="form-group">
                    <label>Rol</label>
                    <select>
                      <option>Seleccionar rol...</option>
                      <option>Admin</option>
                      <option>Cocinero</option>
                      <option>Mozo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Contraseña</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                </form>
              )}

              {modalType === 'plato' && (
                <form>
                  <div className="form-group">
                    <label>Nombre del Plato</label>
                    <input type="text" placeholder="Ej: Milanesa" />
                  </div>
                  <div className="form-group">
                    <label>Categoría</label>
                    <select>
                      <option>Seleccionar categoría...</option>
                      <option>Entradas</option>
                      <option>Platos Principales</option>
                      <option>Postres</option>
                      <option>Bebidas</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea placeholder="Descripción del plato"></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Precio</label>
                      <input type="number" placeholder="0.00" step="0.01" />
                    </div>
                    <div className="form-group">
                      <label>Imagen</label>
                      <input type="file" accept="image/*" />
                    </div>
                  </div>
                </form>
              )}

              {modalType === 'mesa' && (
                <form>
                  <div className="form-group">
                    <label>Número de Mesa</label>
                    <input type="number" placeholder="Ej: 1" min="1" />
                  </div>
                  <div className="form-group">
                    <label>Capacidad (comensales)</label>
                    <input type="number" placeholder="Ej: 4" min="1" />
                  </div>
                  <div className="form-group">
                    <label>Ubicación</label>
                    <input type="text" placeholder="Ej: Salón principal" />
                  </div>
                </form>
              )}

              {modalType === 'horario' && (
                <form>
                  <div className="form-group">
                    <label>Empleado</label>
                    <select>
                      <option>Seleccionar empleado...</option>
                      <option>Juan Pérez</option>
                      <option>María García</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Día</label>
                    <select>
                      <option>Lunes</option>
                      <option>Martes</option>
                      <option>Miércoles</option>
                      <option>Jueves</option>
                      <option>Viernes</option>
                      <option>Sábado</option>
                      <option>Domingo</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Hora Entrada</label>
                      <input type="time" />
                    </div>
                    <div className="form-group">
                      <label>Hora Salida</label>
                      <input type="time" />
                    </div>
                  </div>
                </form>
              )}

              {modalType === 'stock' && (
                <form>
                  <div className="form-group">
                    <label>Nombre del Producto</label>
                    <input type="text" placeholder="Ej: Botella Gaseosa Cola 1L" />
                  </div>
                  <div className="form-group">
                    <label>Cantidad</label>
                    <input type="number" placeholder="0" min="0" />
                  </div>
                  <div className="form-group">
                    <label>Unidad de Medida</label>
                    <select>
                      <option>Unidad</option>
                      <option>Botella</option>
                      <option>Kg</option>
                      <option>L</option>
                      <option>Docena</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Precio Unitario</label>
                    <input type="number" placeholder="0.00" step="0.01" />
                  </div>
                </form>
              )}

              {modalType === 'factura' && (
                <form>
                  <div className="form-group">
                    <label>Mesa / Cliente</label>
                    <input type="text" placeholder="Ej: Mesa 1" />
                  </div>
                  <div className="form-group">
                    <label>Monto Total</label>
                    <input type="number" placeholder="0.00" step="0.01" />
                  </div>
                  <div className="form-group">
                    <label>Método de Pago</label>
                    <select>
                      <option>Efectivo</option>
                      <option>Transferencia</option>
                      <option>Mercado Pago</option>
                      <option>Tarjeta</option>
                    </select>
                  </div>
                </form>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
