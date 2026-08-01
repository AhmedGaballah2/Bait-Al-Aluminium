import "./OrderSuccessDetails";

import { NavLink, useLocation, Navigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

function MailSuccessDetails() {
  const location = useLocation();

  if (!location.state?.fromContactForm) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="order-success" dir="rtl">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container">
              <div className="success-content">
                <div className="icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <h2>تم إرسال بريدك بنجاح!</h2>
                <p>نشكركم على تواصلكم معنا، وسنرد عليكم في أقرب وقت ممكن.</p>
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

export default MailSuccessDetails;
