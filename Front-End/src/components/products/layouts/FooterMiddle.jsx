import { NavLink } from "react-router-dom";

function FooterMiddle() {
  return (
    <>
      <div className="footer-middle">
        <div className="container">
          <div className="bottom-inner">
            <div className="row" dir="rtl">
              <div className="col-lg-3 col-md-6 col-12">
                <div className="single-footer f-contact">
                  <h3>كن على تواصل معنا</h3>
                  <p className="phone">للتواصل: 01017702947</p>
                  <ul>
                    <li>
                      <span>السبت - الخميس:</span> 10:00 صباحا - 10:00 مساء
                    </li>
                    <li>
                      <span>الجمعة: </span> 1:00 ظهرا - 10:00 مساء
                    </li>
                  </ul>
                  <p className="mail">
                    <a href="mailto:agaballah223@gmail.com">
                      agaballah223@gmail.com
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
                      <a href="javascript:void(0)">من نحن؟</a>
                    </li>
                    <li>
                      <NavLink to="/contact-us">تواصل معنا</NavLink>
                    </li>
                    <li>
                      <a href="javascript:void(0)">اطلب الأن</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">اسألنا</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                <div className="single-footer f-link">
                  <h3>أقسام التسوق</h3>
                  <ul>
                    <li>
                      <a href="javascript:void(0)">الألومنيوم</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">الإستانلس</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">الجرانيت</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">الملامين</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">المطابخ</a>
                    </li>
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
