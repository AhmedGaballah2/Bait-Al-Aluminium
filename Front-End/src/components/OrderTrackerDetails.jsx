import "./OrderTrackerDetails.css";
import api from "../services/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

function OrderTrackerDetails() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await api.get(`/orders/track/${trackingNumber}/`);

      setOrder(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setError("لم يتم العثور على طلب بهذا الرقم.");
      } else {
        setError("حدث خطأ أثناء البحث، حاول مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="section"
        dir="rtl"
        style={{ backgroundColor: "rgb(249, 249, 249)" }}
      >
        <div className="container w-100">
          <div className="order-tracker-head">
            <div className="row">
              <div className="col-12">
                <div className="section-head text-center position-relative z-5">
                  <h2 className="position-relative">تتبع طلبك</h2>
                  <p>
                    تتبع طلبك أصبح أسهل من أي وقت مضى. أدخل رقم الطلب لمعرفة
                    حالته الحالية ومتابعة جميع التحديثات حتى وصوله إليك.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="order-search" dir="rtl">
        <div className="container">
          <div className="row align-items-center">
            <div className="content-right text-center">
              <div className="tracker-search-card">
                <label htmlFor="trackingNumber">رقم تتبع الطلب</label>
                <input
                  id="trackingNumber"
                  type="text"
                  placeholder="مثال: 483271"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <button onClick={handleTrackOrder}>
                  {loading ? "جاري البحث..." : "تتبع الطلب"}
                </button>
              </div>

              {error && (
                <div className="track-empty-state">
                  <div className="track-empty-icon">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </div>
                  <h4>لم يتم العثور على الطلب</h4>
                  <p>تأكد من رقم التتبع ثم حاول مرة أخرى.</p>
                  <span>
                    رقم التتبع يتكون من 6 أرقام مثل:
                    <strong> 123456</strong>
                  </span>
                </div>
              )}

              {order && (
                <div className="order-summary-card">
                  <h3>بيانات الطلب</h3>

                  <div className="summary-grid">
                    <div className="summary-item">
                      <span>رقم التتبع:&nbsp;</span>
                      <strong>{order.tracking_number}</strong>
                    </div>

                    <div className="summary-item">
                      <span>اسم العميل:&nbsp;</span>
                      <strong>
                        {order.first_name} {order.last_name}
                      </strong>
                    </div>

                    <div className="summary-item">
                      <span>إجمالي الطلب:&nbsp;</span>
                      <strong>{order.total_price} ج.م</strong>
                    </div>
                  </div>

                  <div className="order-timeline">
                    <div className="timeline-item active">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>تم إنشاء الطلب</h4>
                        <p>تم استلام طلبك بنجاح</p>
                      </div>
                    </div>

                    <div
                      className={`timeline-item ${
                        ["confirmed", "in_transit", "delivered"].includes(
                          order.status,
                        )
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>تم تأكيد الطلب</h4>
                        <p>تم مراجعة الطلب من الإدارة</p>
                      </div>
                    </div>

                    <div
                      className={`timeline-item ${
                        ["in_transit", "delivered"].includes(order.status)
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>جاري الشحن</h4>
                        <p>طلبك في الطريق إليك</p>
                      </div>
                    </div>

                    <div
                      className={`timeline-item ${
                        order.status === "delivered" ? "active" : ""
                      }`}
                    >
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>تم التسليم</h4>
                        <p>تم استلام الطلب بنجاح</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderTrackerDetails;
