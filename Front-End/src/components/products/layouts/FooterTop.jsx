import { NavLink } from "react-router-dom";

import logo from "../../../assets/logo-1.webp";

function FooterTop() {
  return (
    <>
      <div className="footer-top">
        <div className="container">
          <div className="inner-content">
            <div className="row">
              <div className="inner-content-container d-flex justify-content-between align-items-center">
                <div class="footer-logo">
                  <NavLink to="/">
                    <img src={logo} alt="Logo" />
                  </NavLink>
                </div>
                <div class="footer-newsletter">
                  <h4 class="title">
                    تابعنا دائمًا
                    <span>أحدث المنتجات والعروض بين يديك أولاً</span>
                  </h4>
                </div>
                <div class="footer-newsletter">
                  <div className="newsletter-form-head">
                    <form
                      action="#"
                      method="get"
                      target="_blank"
                      class="newsletter-form"
                    >
                      <div class="button">
                        <button class="btn btn-primary border-0 px-4">
                          اشترك<span class="dir-part"></span>
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
