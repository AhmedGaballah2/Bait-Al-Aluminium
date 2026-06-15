import { Routes, Route, useLocation } from "react-router-dom";

import Preloader from "./components/products/layouts/Preloader";
import HomePage from "./pages/HomePage";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";

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

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <ScrollToTop />
    </>
  );
}

export default App;
