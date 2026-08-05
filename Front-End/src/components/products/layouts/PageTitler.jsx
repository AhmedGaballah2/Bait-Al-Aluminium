import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";

const pageNames = {
  "/contact-us": "تواصل معنا",
  "/about": "من نحن؟",
  "/faq": "أسئلة متكررة",
  "/cart": "العربة",
  "/fav": "المفضلة",
  "/checkout": "الشراء",
  "/all-products": "جميع المنتجات",
  "/order-tracker": "تتبع طلبك",
};

function PageTitler() {
  const location = useLocation();

  let currentPage = pageNames[location.pathname] || "";

  if (location.pathname.startsWith("/product/")) {
    currentPage = location.state?.productName || "تفاصيل المنتج";
  }

  if (location.pathname.startsWith("/offer/")) {
    currentPage = location.state?.offerName || "تفاصيل العرض";
  }

  useEffect(() => {
    document.title = currentPage
      ? `بيت الألومنيوم - ${currentPage}`
      : "بيت الألومنيوم";
  }, [currentPage]);

  return (
    <>
      <div className="titler" dir="rtl">
        <div className="container">
          <div className="inner-container row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="titler-content">
                <h1 className="page-title">{currentPage}</h1>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12">
              <ul className="titler-nav text-start m-0 d-flex justify-content-end">
                <li>
                  <NavLink to="/">
                    <FontAwesomeIcon icon={faHome} />
                    &nbsp; الرئيسية
                  </NavLink>
                </li>

                <li>{currentPage}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageTitler;
