import { useState } from 'react';
import api from '../services/api';
import '../styles/ReviewForm.css';

function ReviewForm({ onReviewCreated }) {
  const [observacion, setObservacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/resenias', { observacion });
      setObservacion('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onReviewCreated?.(); // avisa al padre para refrescar la lista
    } catch (err) {
      setError(err.response?.data?.message ?? 'No se pudo enviar la reseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form__title">Dejá tu reseña</h3>

      <textarea
        className="review-form__textarea"
        placeholder="Contanos tu experiencia..."
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        rows={4}
        required
        maxLength={500}
      />
      <span className="review-form__counter">{observacion.length}/500</span>

      {error && <p className="review-form__error">{error}</p>}
      {success && <p className="review-form__success">¡Reseña enviada!</p>}

      <button
        type="submit"
        className="review-form__btn"
        disabled={loading || !observacion.trim()}
      >
        {loading ? 'Enviando...' : 'Enviar reseña'}
      </button>
    </form>
  );
}

export default ReviewForm;