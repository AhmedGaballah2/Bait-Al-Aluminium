import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect } from "react";

import "./ScrollToTop.css";

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <button
        onClick={scrollToTop}
        className={`scroll-top ${visible ? "show" : ""}`}
        aria-label="الرجوع لأعلى الصفحة"
      >
        <FontAwesomeIcon icon={faAngleUp} />
      </button>
    </>
  );
}

export default ScrollToTop;
