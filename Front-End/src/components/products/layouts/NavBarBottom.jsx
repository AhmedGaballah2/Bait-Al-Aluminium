import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";

function NavBarBottom() {
  const location = useLocation();

  const isPagesActive = ["/about", "/faq"].includes(location.pathname);
  const isShopActive = ["/cart", "/checkout", "/fav"].includes(
    location.pathname,
  );

  const [menuActive, setMenuActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);

  const toggleMenu = () => {
    setMenuActive((prev) => !prev);
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/offers/")
      .then((res) => res.json())
      .then((data) => setOffers(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="container">
        <div className="navbar-middle row align-items-center">
          <div className="col-lg-8 col-md-6 col-12">
            <div className="nav-inner">
              <nav className="navbar navbar-expand-lg">
                <button
                  className={`navbar-toggler mobile-menu-btn ${menuActive ? "active" : ""}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded={menuActive}
                  aria-label="Toggle navigation"
                  onClick={toggleMenu}
                >
                  <span className="toggler-icon"></span>
                  <span className="toggler-icon"></span>
                  <span className="toggler-icon"></span>
                </button>
                <div
                  className={`navbar-collapse sub-menu-bar mobile-menu ${menuActive ? "open" : ""}`}
                >
                  <ul
                    id="nav"
                    className="navbar-nav ms-auto d-flex flex-row-reverse"
                  >
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                        to="/"
                        aria-label="Toggle navigation"
                      >
                        الرئيسية
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`dd-menu collapsed ${isPagesActive ? "active-page" : ""}`}
                        href="javascript:void(0)"
                        data-bs-toggle="collapse"
                        data-bs-target="#submenu-1-2"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                      >
                        الصفحات
                      </a>
                      <ul className="sub-menu collapse" id="submenu-1-2">
                        <li className="nav-item">
                          <NavLink className="nav-item" to="/about">
                            من نحن؟
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink className="nav-item" to="/faq">
                            أسألة متكرره
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`dd-menu collapsed ${isShopActive ? "active-page" : ""}`}
                        href="javascript:void(0)"
                        data-bs-toggle="collapse"
                        data-bs-target="#submenu-1-3"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                      >
                        التسوق
                      </a>
                      <ul className="sub-menu collapse" id="submenu-1-3">
                        <li className="nav-item">
                          <NavLink to={"/cart"}>العربة</NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to={"/fav"}>المفضلة</NavLink>
                        </li>
                        <li className="nav-item">
                          <a href="product-list.html">الشراء</a>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a
                        className="dd-menu collapsed"
                        href="javascript:void(0)"
                        data-bs-toggle="collapse"
                        data-bs-target="#submenu-1-4"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                      >
                        العروض
                      </a>
                      <ul className="sub-menu collapse" id="submenu-1-4">
                        {offers.map((offer) => (
                          <li key={offer.id} className="nav-item">
                            <NavLink
                              to={`/offer/${offer.id}`}
                              state={{ offerName: offer.title }}
                            >
                              {offer.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                        to="/contact-us"
                        aria-label="Toggle navigation"
                      >
                        تواصل معنا
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </nav>

              <div className="mega-category-menu">
                <span className="cat-button">جميع الفئات</span>
                <i className="lni lni-menu px-2">
                  <FontAwesomeIcon icon={faBars} />
                </i>
                <ul className="sub-category">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <a href={`/category/${cat.id}`}>{cat.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-12">
            <div className="nav-social">
              <ul style={{ marginTop: "0", marginBottom: "0" }}>
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni">
                      <FontAwesomeIcon
                        icon={faFacebook}
                        style={{ color: "#081828" }}
                      />
                    </i>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni">
                      <FontAwesomeIcon
                        icon={faInstagram}
                        style={{ color: "#081828" }}
                      />
                    </i>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni">
                      <FontAwesomeIcon
                        icon={faWhatsapp}
                        style={{ color: "#081828" }}
                      />
                    </i>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni">
                      <FontAwesomeIcon
                        icon={faTelegram}
                        style={{ color: "#081828" }}
                      />
                    </i>
                  </a>
                </li>
              </ul>
              <h5
                className="title mx-5"
                style={{ marginTop: "0", marginBottom: "0" }}
              >
                :تابعنا
              </h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBarBottom;
