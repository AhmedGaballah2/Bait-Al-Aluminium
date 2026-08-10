import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import api from "../../../services/api";

function FooterMiddle() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories/").then((res) => setCategories(res.data));
  }, []);

  return (
    <>
      <div className="footer-middle">
        <div className="container">
          <div className="bottom-inner">
            <div className="row" dir="rtl">
              <div className="col-lg-3 col-md-6 col-12">
                <div className="single-footer f-contact">
                  <h3>كن على تواصل معنا</h3>
                  <p className="phone">للتواصل: 01069377757</p>
                  <ul>
                    <li>
                      <span>السبت - الخميس:</span> 10:00 صباحا - 10:00 مساء
                    </li>
                    <li>
                      <span>الجمعة: </span> 1:00 ظهرا - 10:00 مساء
                    </li>
                  </ul>
                  <p className="mail">
                    <a href="mailto:beitalaluminium@gmail.com">
                      beitalaluminium@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                <div className="single-footer f-link">
                  <h3>لماذا نحن؟</h3>
                  <ul style={{ color: "#d6d6d6" }}>
                    <li>خامات عالية الجودة</li>
                    <li>ضمان على المنتجات</li>
                    <li>تصنيع وتركيب احترافي</li>
                    <li>أسعار تنافسية</li>
                    <li>خدمة ما بعد البيع</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                <div className="single-footer f-link">
                  <h3>معلومات عنا</h3>
                  <ul>
                    <li>
                      <NavLink to="/about">من نحن؟</NavLink>
                    </li>
                    <li>
                      <NavLink to="/contact-us">تواصل معنا</NavLink>
                    </li>
                    <li>
                      <a href="javascript:void(0)">الشراء</a>
                    </li>
                    <li>
                      <NavLink to={"/faq"}>أسئلة متكررة</NavLink>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                <div className="single-footer f-link">
                  <h3>أقسام التسوق</h3>
                  <ul>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <NavLink
                          to={`/all-products?category=${encodeURIComponent(cat.name)}`}
                        >
                          {cat.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FooterMiddle;
