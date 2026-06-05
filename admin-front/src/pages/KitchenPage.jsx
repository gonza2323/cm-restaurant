import { useState } from 'react'
import './KitchenPage.css'

export default function KitchenPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([
    {
      id: 1,
      mesa: 2,
      plato: 'Milanesa con papas',
      estado: 'SIN_ASIGNAR',
      tiempoSolicitud: '05:30',
      cocinero: null
    },
    {
      id: 2,
      mesa: 5,
      plato: 'Bife de chorizo',
      estado: 'ASIGNADO',
      tiempoSolicitud: '03:45',
      cocinero: 'Carlos'
    },
    {
      id: 3,
      mesa: 3,
      plato: 'Ensalada César',
      estado: 'EN_COCINA',
      tiempoSolicitud: '10:15',
      cocinero: 'Ana'
    },
    {
      id: 4,
      mesa: 1,
      plato: 'Pasta Alfredo',
      estado: 'ENTREGADO',
      tiempoSolicitud: '15:20',
      cocinero: 'Juan'
    }
  ])

  const openModal = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, estado: newStatus } : order
    ))
  }

  const assignOrder = (orderId, cocinero) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, cocinero: cocinero, estado: 'ASIGNADO' } : order
    ))
    closeModal()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'SIN_ASIGNAR':
        return 'status-sin-asignar'
      case 'ASIGNADO':
        return 'status-asignado'
      case 'EN_COCINA':
        return 'status-en-cocina'
      case 'ENTREGADO':
        return 'status-entregado'
      default:
        return ''
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'SIN_ASIGNAR':
        return 'Sin Asignar'
      case 'ASIGNADO':
        return 'Asignado'
      case 'EN_COCINA':
        return 'En Cocina'
      case 'ENTREGADO':
        return 'Entregado'
      default:
        return status
    }
  }

  return (
    <div className="kitchen-page">
      <h1>Panel de Cocina</h1>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{orders.filter(o => o.estado === 'SIN_ASIGNAR').length}</div>
          <div className="stat-label">Sin Asignar</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{orders.filter(o => o.estado === 'ASIGNADO').length}</div>
          <div className="stat-label">Asignados</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{orders.filter(o => o.estado === 'EN_COCINA').length}</div>
          <div className="stat-label">En Cocina</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{orders.filter(o => o.estado === 'ENTREGADO').length}</div>
          <div className="stat-label">Entregados</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Pedidos Pendientes</h2>
        </div>
        <div className="orders-container">
          {orders.map(order => (
            <div key={order.id} className={`order-card ${getStatusColor(order.estado)}`}>
              <div className="order-header">
                <div className="order-mesa">
                  <span className="mesa-badge">Mesa {order.mesa}</span>
                </div>
                <div className={`order-status ${getStatusColor(order.estado)}`}>
                  {getStatusLabel(order.estado)}
                </div>
              </div>

              <div className="order-body">
                <h3>{order.plato}</h3>
                <div className="order-info">
                  <div className="info-item">
                    <span className="label">Tiempo en cocina:</span>
                    <span className="value">{order.tiempoSolicitud}</span>
                  </div>
                  {order.cocinero && (
                    <div className="info-item">
                      <span className="label">Asignado a:</span>
                      <span className="value">{order.cocinero}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-actions">
                {order.estado === 'SIN_ASIGNAR' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openModal(order)}
                  >
                    Asignar
                  </button>
                )}
                {order.estado === 'ASIGNADO' && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => updateOrderStatus(order.id, 'EN_COCINA')}
                  >
                    Iniciar Cocina
                  </button>
                )}
                {order.estado === 'EN_COCINA' && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => updateOrderStatus(order.id, 'ENTREGADO')}
                  >
                    Marcar Entregado
                  </button>
                )}
                {order.estado !== 'ENTREGADO' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => openModal(order)}
                  >
                    Detalles
                  </button>
                )}
              </div>

              {order.estado === 'EN_COCINA' && (
                <div className="urgency-indicator">
                  ⏰ {order.tiempoSolicitud}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {selectedOrder.estado === 'SIN_ASIGNAR'
                  ? 'Asignar Pedido'
                  : 'Detalles del Pedido'}
              </h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="order-details">
                <div className="detail-row">
                  <span className="label">Mesa:</span>
                  <span className="value">{selectedOrder.mesa}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Plato:</span>
                  <span className="value">{selectedOrder.plato}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Estado:</span>
                  <span className="value">
                    <span className={`badge ${getStatusColor(selectedOrder.estado)}`}>
                      {getStatusLabel(selectedOrder.estado)}
                    </span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Tiempo en Cocina:</span>
                  <span className="value">{selectedOrder.tiempoSolicitud}</span>
                </div>
                {selectedOrder.cocinero && (
                  <div className="detail-row">
                    <span className="label">Asignado a:</span>
                    <span className="value">{selectedOrder.cocinero}</span>
                  </div>
                )}
              </div>

              {selectedOrder.estado === 'SIN_ASIGNAR' && (
                <div className="form-group">
                  <label>Asignar a Cocinero</label>
                  <select id="cocinero-select">
                    <option value="">Seleccionar cocinero...</option>
                    <option value="Carlos">Carlos</option>
                    <option value="Ana">Ana</option>
                    <option value="Juan">Juan</option>
                    <option value="María">María</option>
                  </select>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
              {selectedOrder.estado === 'SIN_ASIGNAR' && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const select = document.getElementById('cocinero-select')
                    if (select.value) {
                      assignOrder(selectedOrder.id, select.value)
                    }
                  }}
                >
                  Asignar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
