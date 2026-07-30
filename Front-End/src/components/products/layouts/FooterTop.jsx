import { NavLink } from "react-router-dom";

import logo from "../../../assets/Logos/Logo Footer1.png";

function FooterTop() {
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
                      action="#"
                      method="get"
                      target="_blank"
                      className="newsletter-form"
                    >
                      <div className="button">
                        <button className="btn btn-primary border-0 px-4">
                          اشترك<span className="dir-part"></span>
                        </button>
                      </div>
                      <input
                        className="text-end"
                        name="EMAIL"
                        placeholder="...عنوان البريد الإلكتروني هنا"
                        type="email"
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
