import React from 'react';

const ProductElement = ({ product }) => {
	if (!product) return null;

	const { nombre, descripcion, precio, imageUrl } = product;

	return (
		<article className="product-element">

			<div className="product-element__content">
				<div className="product-element__main">
					<div className="product-element__header">
						<h3 className="product-element__name">{nombre}</h3>
					</div>

					{descripcion ? <p className="product-element__description">{descripcion}</p> : null}

					{precio !== undefined && precio !== null ? (
						<strong className="product-element__price">${precio}</strong>
					) : null}
				</div>

				{imageUrl ? <img className="product-element__image" src={imageUrl} alt={nombre} /> : null}
			</div>
		</article>
	);
};

export default ProductElement;
