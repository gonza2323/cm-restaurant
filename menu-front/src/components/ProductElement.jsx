import React from 'react';

const CATEGORY_LABELS = {
	main: 'Plato principal',
	drink: 'Bebida',
	dessert: 'Postre',
};

const ProductElement = ({ product }) => {
	if (!product) return null;

	const { name, description, price, category, image } = product;
	const categoryLabel = CATEGORY_LABELS[category] || category;

	return (
		<article className="product-element">

			<div className="product-element__content">
				<div className="product-element__main">
					<div className="product-element__header">
						<h3 className="product-element__name">{name}</h3>
					</div>

					{description ? <p className="product-element__description">{description}</p> : null}

					{price !== undefined && price !== null ? (
						<strong className="product-element__price">${price}</strong>
					) : null}
				</div>

				{image ? <img className="product-element__image" src={image} alt={name} /> : null}
			</div>
		</article>
	);
};

export default ProductElement;
