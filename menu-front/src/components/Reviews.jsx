import React from "react";

function Reviews({ review }) {
  return (
    <article className="review-card">
      <header className="review-header">
        <h4 className="review-author">{review.author}</h4>
        <p className="review-stars">
          {"⭐".repeat(review.stars)}
        </p>
      </header>

      <p className="review-text">
        {review.comment || "Sin comentario"}
      </p>
    </article>
  );
}
export default Reviews;