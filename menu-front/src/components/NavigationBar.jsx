import { useState } from 'react';
import LoginButtons from './LoginButtons';
import { slide as Menu } from 'react-burger-menu';
import '../styles/index.css';


function NavigationBar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const navLinks = (
    <>
      <a href="#entradas" className="navigation-link bm-item" onClick={closeMenu}>Entradas</a>
      <a href="#platos-principales" className="navigation-link bm-item" onClick={closeMenu}>Platos principales</a>
      <a href="#bebidas" className="navigation-link bm-item" onClick={closeMenu}>Bebidas</a>
      <a href="#postres" className="navigation-link bm-item" onClick={closeMenu}>Postres</a>
      <a href="#resenias" className="navigation-link bm-item" onClick={closeMenu}>Reseñas</a>

    </>
  );

  return (
    <>
      <div className="burger-menu-wrapper">
        <Menu
          right
          isOpen={open}
          onStateChange={(state) => setOpen(state.isOpen)}
        >
          {navLinks}
          <div className="burger-menu-actions">
            <LoginButtons onAction={closeMenu} />
          </div>
        </Menu>
      </div>


      <nav className="navigation-bar" aria-label="Secciones del menú">
        <div className="navigation-links">
          {navLinks}
          <div className="navigation-actions">
            <LoginButtons onAction={closeMenu} />
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavigationBar;