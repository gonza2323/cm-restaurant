import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import ReviewForm from './ReviewForm'; 

import '../styles/CreateReview.css';

function CreateReview({ onReviewCreated }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <ReviewForm onReviewCreated={onReviewCreated} />;
  }

  return (
    <section className="create-review">
      <div className="create-review__card">
        <div className="create-review__content">
          <h2 className="create-review__title">¿Querés dejar una reseña?</h2>
          <p className="create-review__description">
            Inicia sesión o registrate para compartir tu experiencia en nuestro restaurante
          </p>
          <div className="create-review__actions">
            <Link to="/login" className="nav-btn nav-btn--login">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="nav-btn nav-btn--register">
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateReview;


