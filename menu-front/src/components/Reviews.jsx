import React from "react";

function Reviews({ review }) {
  return (
    <div>
      <article className="review-card">
        <header className="review-header">
            <h4 className="review-author">{`${review.cliente?.nombre ?? ''} ${review.cliente?.apellido ?? ''}`.trim()}</h4>

          <p className="review-text">
          {review.observacion || "Sin comentario"}
          </p>
        </header>
      </article>
      
    </div>
    // <article className="review-card">
    //   <header className="review-header">
    //     <h4 className="review-author">{review.cliente}</h4>
    //   </header>

    //   
    // </article>
  );
}
export default Reviews;