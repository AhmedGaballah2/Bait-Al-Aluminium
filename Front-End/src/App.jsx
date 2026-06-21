import { Routes, Route, useLocation } from "react-router-dom";

import Preloader from "./components/products/layouts/Preloader";
import HomePage from "./pages/HomePage";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Fav from "./pages/Fav";

import { CartProvider } from "./components/products/layouts/CartContext";
import { WishlistProvider } from "./components/products/layouts/WishlistContext";

import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setLoading(true);
  }

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <>
      {loading && <Preloader />}

      <WishlistProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/fav" element={<Fav />} />

            <Route path="*" element={<NotFound />} />
          </Routes>

          <ScrollToTop />
        </CartProvider>
      </WishlistProvider>
    </>
  );
}

export default App;
