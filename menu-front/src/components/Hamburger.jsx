// src/components/Hamburger.jsx
function Hamburger({ open, onClick }) {
  return (
    <button
      className={`hamburger ${open ? 'hamburger--open' : ''}`}
      onClick={onClick}
      aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      aria-expanded={open}
    >
      <span />
      <span />
      <span />
    </button>
  );
}

export default Hamburger;