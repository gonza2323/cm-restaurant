import MenuSection from "./MenuSection";
import menu from "../data/products";

import { useEffect, useState } from "react";
import { getCarta } from "../services/cartaService";

function Menu() {

  const [menu, setMenu] = useState(null);       
  const [cargando, setCargando] = useState(true); 
  const [error, setError] = useState(null);
  

  //se puede usar una lib tanstackquery para que no sea tan feo esto
  useEffect(() => {
    const fetchCarta = async () => {
      try {
        const data = await getCarta(); 
        setMenu(data); 
      } catch (err) {
        setError('Error al cargar la carta'); 
      } finally {
        setCargando(false); 
      }
    };

    fetchCarta();
  }, []);

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;   
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