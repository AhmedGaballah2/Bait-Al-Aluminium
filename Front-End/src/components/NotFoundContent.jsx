import "./NotFoundContent.css";

import { NavLink } from "react-router-dom";

function NotFoundContent() {
  return (
    <>
      <div className="error-area" dir="rtl">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container">
              <div className="error-content">
                <h1>404</h1>
                <h2>عذرًا، الصفحة غير موجودة!</h2>
                <p>
                  الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها أو أن
                  الرابط غير صحيح.
                </p>
                <div className="button">
                  <NavLink to={"/"} className="btn">
                    العودة للصفحة الرئيسية
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFoundContent;
