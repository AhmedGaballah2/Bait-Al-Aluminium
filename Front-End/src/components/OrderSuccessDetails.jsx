import "./OrderSuccessDetails.css";

import { NavLink, Navigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckFast } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

function OrderSuccessDetails() {
  const location = useLocation();
  const trackingNumber = location.state?.trackingNumber;

  if (!location.state?.fromCheckout) {
    return <Navigate to="/" replace />;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trackingNumber);

    toast.success("تم نسخ رقم التتبع", {
      duration: 2000,
    });
  };

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
                {trackingNumber && (
                  <div className="tracking-number-box">
                    <h5>رقم تتبع الطلب</h5>

                    <div className="tracking-content">
                      <span className="tracking-number">{trackingNumber}</span>

                      <button className="copy-btn" onClick={handleCopy}>
                        📋 نسخ الرقم
                      </button>
                    </div>

                    <small>
                      احتفظ بهذا الرقم لاستخدامه في متابعة حالة طلبك.
                    </small>
                  </div>
                )}
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
