import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { useState } from 'react';

import ProtectedRoute from './components/ProtectedRoute';

import Header from "./components/Header";
import NavigationBar from "./components/NavigationBar";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import ReviewsList from "./components/ReviewsList";
import CreateReview from "./components/CreateReview";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Perfil from './pages/Perfil';

import './styles/index.css';

function App() {
  const [reviewKey, setReviewKey] = useState(0);

  return (
    <AuthProvider>
      <Routes>
         <Route path="/" element={
          <>
            <Header />
            <NavigationBar />
            <Menu />
            <CreateReview onReviewCreated={() => setReviewKey(k => k + 1)} />
            <ReviewsList key={reviewKey} />
            <Footer />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
export default App;