import { Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import NavigationBar from "./components/NavigationBar";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import ReviewsList from "./components/ReviewsList";
import CreateReview from "./components/CreateReview";
import Login from "./pages/Login";
import Register from "./pages/Register";

import './styles/index.css';

function HomePage() {
  return (
    <>
      <Header />
      <NavigationBar />
      <Menu />
      <CreateReview />
      <ReviewsList />
      <Footer />
    </>
  );
}

//agregar guardas de rutas (desp de hacer lo del contexto)
//jwt 
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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
  );
}

export default App;