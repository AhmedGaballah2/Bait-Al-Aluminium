import "./OrderSuccessDetails.css";

import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTruckFast } from "@fortawesome/free-solid-svg-icons";

function OrderSuccessDetails() {
  return (
    <>
      <div className="order-success" dir="rtl">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container">
              <div className="success-content">
                <div className="icon">
                  <FontAwesomeIcon icon={faTruckFast} />
                </div>
                <h2>تم تسجيل الطلب بنجاح!</h2>
                <p>
                  شكراً لطلبك. سيتم معالجة طلبك والتواصل معك للتأكيد في خلال 24
                  ساعة.
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

export default OrderSuccessDetails;
