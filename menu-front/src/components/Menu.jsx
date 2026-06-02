import MenuSection from "./MenuSection";
import menu from "../data/products";

function Menu() {
  return (
    <>
      {menu.secciones.map(seccion => (
        <MenuSection
          key={seccion.id}
          title={seccion.nombre}
          products={seccion.items}
        />
      ))}
    </>
  );
}

export default Menu;