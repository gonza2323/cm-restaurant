import { useState } from 'react'
import './WaiterPage.css'

export default function WaiterPage() {
  const [tables, setTables] = useState([
    { id: 1, numero: 1, capacidad: 4, estado: 'libre', comensales: 0, pedidos: [] },
    { id: 2, numero: 2, capacidad: 2, estado: 'ocupada', comensales: 2, pedidos: ['Milanesa', 'Ensalada'] },
    { id: 3, numero: 3, capacidad: 6, estado: 'libre', comensales: 0, pedidos: [] },
    { id: 4, numero: 4, capacidad: 4, estado: 'ocupada', comensales: 3, pedidos: ['Bife', 'Pasta'] },
  ])

  const [selectedTable, setSelectedTable] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(null)

  const openModal = (type, table) => {
    setSelectedTable(table)
    setModalType(type)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedTable(null)
    setModalType(null)
  }

  const toggleTableStatus = (tableId) => {
    setTables(tables.map(table =>
      table.id === tableId
        ? {
          ...table,
          estado: table.estado === 'libre' ? 'ocupada' : 'libre',
          comensales: table.estado === 'libre' ? 0 : 0,
          pedidos: table.estado === 'libre' ? [] : table.pedidos
        }
        : table
    ))
  }

  const addOrder = (tableId, plato) => {
    setTables(tables.map(table =>
      table.id === tableId
        ? { ...table, pedidos: [...table.pedidos, plato] }
        : table
    ))
    closeModal()
  }

  const registerTip = (tableId, tip) => {
    // TODO: Registrar la propina en el backend
    toggleTableStatus(tableId)
    closeModal()
  }

  const menuItems = {
    'Entradas': ['Tabla de Quesos', 'Tabla de Jamón', 'Empanadas', 'Calamares Fritos'],
    'Platos Principales': ['Milanesa', 'Bife de Chorizo', 'Pasta Alfredo', 'Pechuga a la Mostaza', 'Salmón a la Mantequilla'],
    'Postres': ['Flan', 'Tiramisú', 'Helado', 'Postre del Día'],
    'Bebidas': ['Coca Cola', 'Agua', 'Cerveza', 'Vino Tinto', 'Vino Blanco', 'Jugo Natural']
  }

  return (
    <div className="waiter-page">
      <h1>Panel de Mozo</h1>

      <div className="waiter-info">
        <div className="info-card">
          <span className="info-label">Mesas Libres:</span>
          <span className="info-value">{tables.filter(t => t.estado === 'libre').length}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Mesas Ocupadas:</span>
          <span className="info-value">{tables.filter(t => t.estado === 'ocupada').length}</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Estado de Mesas</h2>
        </div>
        <div className="tables-grid">
          {tables.map(table => (
            <div
              key={table.id}
              className={`table-card ${table.estado === 'ocupada' ? 'ocupada' : 'libre'}`}
            >
              <div className="table-header">
                <div className="table-number">Mesa {table.numero}</div>
                <div className={`table-status ${table.estado}`}>
                  {table.estado === 'libre' ? '✓ Libre' : '● Ocupada'}
                </div>
              </div>

              <div className="table-body">
                <div className="table-detail">
                  <span className="label">Capacidad:</span>
                  <span className="value">{table.capacidad} comensales</span>
                </div>
                {table.estado === 'ocupada' && (
                  <>
                    <div className="table-detail">
                      <span className="label">Comensales:</span>
                      <span className="value">{table.comensales}</span>
                    </div>
                    {table.pedidos.length > 0 && (
                      <div className="table-detail">
                        <span className="label">Pedidos:</span>
                        <div className="pedidos-list">
                          {table.pedidos.map((plato, idx) => (
                            <span key={idx} className="badge-plato">{plato}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="table-actions">
                {table.estado === 'libre' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => toggleTableStatus(table.id)}
                  >
                    Ocupar Mesa
                  </button>
                )}
                {table.estado === 'ocupada' && (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openModal('pedido', table)}
                    >
                      Agregar Pedido
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => openModal('propina', table)}
                    >
                      Cerrar Cuenta
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedTable && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {modalType === 'pedido' && `Agregar Pedido - Mesa ${selectedTable.numero}`}
                {modalType === 'propina' && `Registrar Propina - Mesa ${selectedTable.numero}`}
              </h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              {modalType === 'pedido' && (
                <div>
                  <p style={{ marginBottom: '1.5rem', color: 'var(--text-light)' }}>
                    Selecciona los productos a agregar:
                  </p>
                  {Object.entries(menuItems).map(([categoria, items]) => (
                    <div key={categoria} className="category-section">
                      <h3>{categoria}</h3>
                      <div className="items-grid">
                        {items.map((item, idx) => (
                          <button
                            key={idx}
                            className="item-button"
                            onClick={() => {
                              addOrder(selectedTable.id, item)
                            }}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {modalType === 'propina' && (
                <div className="tip-form">
                  <div className="form-group">
                    <label>Monto de la Cuenta</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      id="cuenta-monto"
                      defaultValue="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label>Propina</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      id="propina-monto"
                      defaultValue="0.00"
                    />
                  </div>
                  <div className="tip-options">
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        const cuenta = parseFloat(document.getElementById('cuenta-monto').value)
                        document.getElementById('propina-monto').value = (cuenta * 0.1).toFixed(2)
                      }}
                    >
                      10%
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        const cuenta = parseFloat(document.getElementById('cuenta-monto').value)
                        document.getElementById('propina-monto').value = (cuenta * 0.15).toFixed(2)
                      }}
                    >
                      15%
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        const cuenta = parseFloat(document.getElementById('cuenta-monto').value)
                        document.getElementById('propina-monto').value = (cuenta * 0.20).toFixed(2)
                      }}
                    >
                      20%
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
              {modalType === 'propina' && (
                <button
                  className="btn btn-primary"
                  onClick={() => registerTip(selectedTable.id, document.getElementById('propina-monto').value)}
                >
                  Registrar y Cerrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
