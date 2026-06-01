import React from 'react';

function Header() {
  return (
	<header className="app-header">
	  <div className="header-inner">
		<h1 className="header-title">Menu</h1>

		<div className="header-meta">
		  <p className="meta-small">Restaurante</p>
		  <p className="meta-name">Lo de Fer</p>
		</div>
	  </div>
	</header>
  );
}

export default Header;
