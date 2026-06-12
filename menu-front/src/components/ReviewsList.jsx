import React from 'react';
import Reviews from "./Reviews";
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../services/api';


function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


 const fetchReviews = () => {
    setLoading(true);
    api.get('/resenias')
      .then(res => setReviews(res.data))
      .catch(() => setError('No se pudieron cargar las reseñas.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []); 

  if (loading) return <p>Cargando reseñas...</p>;
  if (error)   return <p>{error}</p>;

  return (
    <div id="resenias"className="reviews-list">
      {reviews.map((review) => (
        <Reviews key={review.id} review={review} />
      ))}
    </div>
  );
}

export default ReviewsList;
