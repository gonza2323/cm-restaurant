import ProductElement from "./ProductElement";


function MenuSection({ title, products }) {
  const slug = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <section id={slug} className={`menu-section menu-section--${slug}`}>
      <div className="menu-section__bar">
        <div className="menu-section__inner">
          <h2 className="menu-section__title">{title}</h2>
        </div>
      </div>

      {products.map(product => (
        <ProductElement
          key={product.id}
          product={product}
        />
      ))}
    </section>
  );
}

export default MenuSection;