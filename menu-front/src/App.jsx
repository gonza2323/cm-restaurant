import Header from "./components/Header";
import NavigationBar from "./components/NavigationBar";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import ReviewsList from "./components/ReviewsList";

import './index.css';

function App() {
  return (
    <>
      <Header />
      <NavigationBar />
      <Menu />
      <ReviewsList  />
      <Footer />
    </>
  );
}

export default App;