import React from 'react';
import reviews from '../data/reviews';
import Reviews from "./Reviews";

function ReviewsList() {
  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <Reviews
          key={review.id}
          review={review}
        />
      ))}
    </div>
  );
}
export default ReviewsList;
