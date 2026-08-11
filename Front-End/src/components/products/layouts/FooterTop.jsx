import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import logo from "../../../assets/Logos/Logo Footer1.png";

function FooterTop() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = () => {
    if (!isValidEmail) {
      return;
    }

    navigate("/mail-success", {
      state: {
        fromNewsletter: true,
      },
    });
  };

  return (
    <>
      <div className="footer-top">
        <div className="container">
          <div className="inner-content">
            <div className="row">
              <div className="inner-content-container d-flex justify-content-between align-items-center">
                <div className="footer-logo">
                  <NavLink to="/">
                    <img src={logo} alt="Logo" />
                  </NavLink>
                </div>

                <div className="footer-newsletter">
                  <h4 className="title">
                    تابعنا دائمًا
                    <span>أحدث المنتجات والعروض بين يديك أولاً</span>
                  </h4>
                </div>

                <div className="footer-newsletter">
                  <div className="newsletter-form-head">
                    <form
                      className="newsletter-form"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div className="button">
                        <button
                          type="button"
                          onClick={handleSubscribe}
                          disabled={!isValidEmail}
                          className="btn btn-primary border-0 px-4"
                        >
                          اشترك
                          <span className="dir-part"></span>
                        </button>
                      </div>

                      <input
                        className="text-end"
                        name="EMAIL"
                        placeholder="...عنوان البريد الإلكتروني هنا"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FooterTop;
