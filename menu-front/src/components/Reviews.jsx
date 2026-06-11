import React from "react";
import "../styles/Review.css";
import { BASE_URL } from '../config';

function Reviews({ review }) {
  // Ajustamos el parseo de la fecha para evitar problemas de zona horaria con el formato YYYY-MM-DD
  const fechaFormateada = review.fecha 
    ? new Date(`${review.fecha}T00:00:00`).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "Fecha no disponible";

  return (
    <article className="review-card">
      <header className="review-header">
        
        <div className="review-author-info">
          {/* Concatenación de BASE_URL con la imagen que viene dentro de review.cliente */}
          <img 
            src={`${BASE_URL}${review.cliente?.imageUrl || ''}`} 
            alt={`Foto de ${review.cliente?.nombre || 'usuario'}`} 
            className="review-avatar"
          />
          
          <div className="review-meta">
            <h4 className="review-author">
              {`${review.cliente?.nombre ?? ''} ${review.cliente?.apellido ?? ''}`.trim() || "Usuario Anónimo"}
            </h4>
            <span className="review-date">{fechaFormateada}</span>
          </div>
        </div>

      </header>
      
      <div className="review-content">
        <p className="review-text">
          {review.observacion || "Sin comentario"}
        </p>
      </div>
    </article>
  );
}

export default Reviews;