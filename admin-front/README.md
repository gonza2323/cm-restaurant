# 🍽️ Restaurant Admin Front

Frontend de administración para el sistema de restaurante construido con React y Vite.

## Características

### 👥 Panel de Admin
- **ABM Usuarios**: Gestionar usuarios del sistema (Admin, Cocinero, Mozo)
- **ABM Carta**: Crear y modificar platos del menú por categorías (Entradas, Platos Principales, Postres, Bebidas)
- **ABM Mesas**: Dar de alta mesas del restaurante
- **ABM Horarios**: Gestionar horarios de trabajo del personal
- **Gestión de Stock**: Administrar inventario de productos
- **Gestión de Facturas**: Registrar ventas y cobros

### 👨‍🍳 Panel de Cocinero
- Ver pedidos sin asignar, asignados, en cocina y entregados
- Asignar pedidos a cocineros específicos
- Cambiar estados de pedidos (SIN_ASIGNAR → ASIGNADO → EN_COCINA → ENTREGADO)
- Visualizar tiempos de cocina con alertas de urgencia
- Dashboard de estadísticas

### 👨‍💼 Panel de Mozo
- Ver estado de todas las mesas (Libre/Ocupada)
- Marcar mesas como libres u ocupadas
- Agregar pedidos desde el menú a las mesas
- Registrar propinas con cálculo automático (10%, 15%, 20%)
- Cerrar cuenta de mesas

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la build de producción
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/
│   └── Header.jsx           # Componente de encabezado
├── pages/
│   ├── AdminPage.jsx        # Panel de administración
│   ├── KitchenPage.jsx      # Panel de cocina
│   └── WaiterPage.jsx       # Panel de mozo
├── styles/
│   ├── index.css            # Estilos globales
│   └── *.css                # Estilos específicos por componente
├── App.jsx                  # Componente principal
└── main.jsx                 # Entrada de la aplicación
```

## Autenticación

El sistema actualmente tiene un simulador de autenticación. Para integrar tu sistema de auth real:

1. Reemplaza el `useState` en `App.jsx` con tu hook/servicio de auth
2. Usa el estado de usuario para renderizar la página correcta según el rol
3. Cambia el flujo de logout para llamar a tu endpoint de logout

```javascript
// En App.jsx
const [userRole, setUserRole] = useState('admin') // TODO: Reemplazar con tu auth
```

## Condicionales por Rol

Los componentes ya están preparados para mostrar/ocultar funcionalidades según el rol. Ejemplo:

```javascript
{userRole === 'admin' && <AdminPage />}
{userRole === 'cocinero' && <KitchenPage />}
{userRole === 'mozo' && <WaiterPage />}
```

## Colores del Sistema

- **Primario**: #ff6b35 (Naranja)
- **Secundario**: #004e89 (Azul oscuro)
- **Terciario**: #1b7c0f (Verde)

## API Integration

El proxy está configurado para redirigir requests a `/api/*` hacia `http://localhost:8080`.

Actualiza el `vite.config.js` según sea necesario para cambiar la URL del backend.

## TODO

- [ ] Integrar con sistema de auth real
- [ ] Conectar endpoints del backend
- [ ] Validación de formularios
- [ ] Manejo de errores
- [ ] Temas oscuros/claros
- [ ] Internacionalización (i18n)

## Notas para el Desarrollo

- Las páginas tienen datos mock para demostración
- Los modales están listos para conectar con backend
- Las funciones de estado ya están implementadas para testing
- Los estilos son responsive (mobile, tablet, desktop)

## Licencia

Proyecto escolar - Ingeniería de Software
