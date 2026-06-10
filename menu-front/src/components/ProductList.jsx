import ProductElement from "./ProductElement";
import products from "../data/products";

function ProductList() {
  return (
    <div>
      {products.map((product) => (
        <ProductElement
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

export default ProductList;