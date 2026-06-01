import MenuSection from "./MenuSection";
import products from "../data/products";

function Menu() {

  const main = products.filter(
    product => product.category === "main"
  );

  const drink = products.filter(
    product => product.category === "drink"
  );

  const dessert = products.filter(
    product => product.category === "dessert"
  );
    return (
    <>
      <MenuSection title="Platos principales" products={main} />
      <MenuSection title="Bebidas" products={drink} />
      <MenuSection title="Postres" products={dessert} />
    </>
    );
}

export default Menu;