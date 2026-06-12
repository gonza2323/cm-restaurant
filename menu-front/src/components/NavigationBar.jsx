import { useState } from 'react';
import LoginButtons from './LoginButtons';

function NavigationBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navigation-bar" aria-label="Secciones del menú">

      {/* Links visibles siempre en desktop, ocultos en mobile */}
      <div className={`navigation-links ${open ? 'navigation-links--open' : ''}`}>
        <a href="#entradas" className="navigation-link" onClick={() => setOpen(false)}>
          Entradas
        </a>
        <a href="#platos-principales" className="navigation-link" onClick={() => setOpen(false)}>
          Platos principales
        </a>
        <a href="#bebidas" className="navigation-link" onClick={() => setOpen(false)}>
          Bebidas
        </a>
        <a href="#postres" className="navigation-link" onClick={() => setOpen(false)}>
          Postres
        </a>
        <div className="navigation-actions">
          <LoginButtons onAction={() => setOpen(false)} />
        </div>
      </div>

    </nav>
  );
}

export default NavigationBar;