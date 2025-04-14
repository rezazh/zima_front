import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Products from "./components/Products";
import MenProducts from "./pages/MenProducts";
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';  // اضافه کردن import هدر
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="app-container"> {/* اضافه کردن یک div برای ساختار بهتر */}
          <Header />  {/* قرار دادن هدر قبل از Routes */}
          <main className="main-content"> {/* اضافه کردن main برای محتوای اصلی */}
            <Routes>
              <Route path="/men" element={<MenProducts />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </main>
          <Footer />  {/* قرار دادن فوتر بعد از Routes */}
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;