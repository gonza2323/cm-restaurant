import Menu from "./Menu";

function NavigationBar() {
  return (
    <nav className="navigation-bar" aria-label="Secciones del menú">
      <a href="#platos-principales" className="navigation-link">Platos principales</a>
      <a href="#bebidas" className="navigation-link">Bebidas</a>
      <a href="#postres" className="navigation-link">Postres</a>
    </nav>
  );
}

export default NavigationBar;