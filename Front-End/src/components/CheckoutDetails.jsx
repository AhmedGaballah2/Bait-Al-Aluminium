import "./CheckoutDetails.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

import Accordion from "react-bootstrap/Accordion";

import { useCart } from "./products/layouts/CartContext";
import { NavLink, useNavigate } from "react-router-dom";

import { useState } from "react";

import { governorates } from "../components/products/data/governorates";

function CheckoutDetails() {
  const [activeKey, setActiveKey] = useState("0");

  const [governorate, setGovernorate] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { cartItems, clearCart } = useCart();

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (item.oldPrice || item.old_price || item.price) * item.quantity,
    0,
  );

  const productsTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalDiscount = cartItems.reduce(
    (total, item) =>
      total +
      (item.oldPrice || item.old_price
        ? ((item.oldPrice || item.old_price) - item.price) * item.quantity
        : 0),
    0,
  );

  const isCartEmpty = cartItems.length === 0;

  const upperEgyptAndSinaiGovernorates = [
    "الفيوم",
    "بني سويف",
    "المنيا",
    "أسيوط",
    "سوهاج",
    "قنا",
    "الأقصر",
    "أسوان",
    "شمال سيناء",
    "جنوب سيناء",
  ];

  const shippingCost =
    productsTotal >= 2500
      ? 0
      : upperEgyptAndSinaiGovernorates.includes(governorate)
        ? 120
        : 80;

  const finalTotal = productsTotal + shippingCost;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    buildingNumber: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(01)[0-2,5]{1}[0-9]{8}$/;

  const validateStep1 = () => {
    let newErrors = {};

    if (!formData.firstName || !nameRegex.test(formData.firstName)) {
      newErrors.firstName = "الاسم الأول يجب أن يحتوى على حروف فقط";
    }

    if (!formData.lastName || !nameRegex.test(formData.lastName)) {
      newErrors.lastName = "الاسم الأخير يجب أن يحتوى على حروف فقط";
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "بريد إلكتروني غير صحيح";
    }

    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};

    if (!governorate) {
      newErrors.governorate = "اختر المحافظة";
    }

    if (!formData.city) {
      newErrors.city = "اكتب المدينة";
    }

    if (!formData.address) {
      newErrors.address = "اكتب العنوان";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    setSubmitError(null);
    setShowConfirmDialog(false);

    if (isCartEmpty) {
      setSubmitError("لا يمكنك إنشاء طلب بدون منتجات في السلة.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        governorate: governorate,
        city: formData.city,
        address: formData.address,
        building_number: formData.buildingNumber,
        total_price: productsTotal,
        shipping_cost: shippingCost,
        products_count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        notes: formData.notes,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("http://localhost:8000/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Order created successfully:", result);

        clearCart();

        navigate("/checkout/success");
      } else {
        setSubmitError("فشل إنشاء الطلب. حاول مرة أخرى.");
        console.error("Error response:", response.status);
      }
    } catch (error) {
      setSubmitError("حدث خطأ في الاتصال بالسيرفر. حاول مرة أخرى.");
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="checkout-wrapper section"
        style={{ backgroundColor: "#f9f9f9" }}
        dir="rtl"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="right">
                <ul className="cart-summary-list">
                  <li>
                    إجمالي المنتجات:
                    <span>{subtotal} جنيه</span>
                  </li>

                  <li>
                    إجمالي الخصومات:
                    <span>{totalDiscount} جنيه</span>
                  </li>

                  <li>
                    تكلفة الشحن:
                    <span>
                      {shippingCost === 0 ? "مجاني" : `${shippingCost} جنيه`}
                    </span>
                  </li>

                  <li className="fw-bold">
                    المبلغ المستحق:
                    <span>{finalTotal} جنيه</span>
                  </li>
                </ul>
                <div className="button">
                  <NavLink className="btn" to={"/all-products"}>
                    الإستمرار في التسوق
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="checkout-steps-form-style-1">
                {submitError && (
                  <div className="alert alert-danger">{submitError}</div>
                )}
                <div style={{ direction: "rtl" }}>
                  <Accordion
                    activeKey={activeKey}
                    onSelect={(key) => setActiveKey(key)}
                    flush
                  >
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <span className="personal-details">
                          معلوماتك الشخصية
                        </span>
                        <div className="personal-icons">
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="icon-plus"
                          />
                          <FontAwesomeIcon
                            icon={faMinus}
                            className="icon-minus"
                          />
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="single-form form-default">
                              <label>الاسم الكامل</label>
                              <div className="row">
                                <div className="col-md-6 form-input form">
                                  <input
                                    type="text"
                                    placeholder="الاسم الأول"
                                    value={formData.firstName}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        firstName: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                  {errors.firstName && (
                                    <span className="error-text">
                                      {errors.firstName}
                                    </span>
                                  )}
                                </div>
                                <div className="col-md-6 form-input form">
                                  <input
                                    type="text"
                                    placeholder="الاسم الأخير"
                                    value={formData.lastName}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        lastName: e.target.value,
                                      })
                                    }
                                  />

                                  {errors.lastName && (
                                    <span className="error-text">
                                      {errors.lastName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="single-form form-default">
                              <label>البريد الإلكتروني</label>
                              <div className="form-input form">
                                <input
                                  type="email"
                                  placeholder="البريد الإلكتروني"
                                  value={formData.email}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      email: e.target.value,
                                    })
                                  }
                                />

                                {errors.email && (
                                  <span className="error-text">
                                    {errors.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="single-form form-default">
                              <label>رقم الهاتف</label>
                              <div className="form-input form">
                                <input
                                  type="text"
                                  placeholder="رقم الهاتف"
                                  value={formData.phone}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      phone: e.target.value,
                                    })
                                  }
                                />

                                {errors.phone && (
                                  <span className="error-text">
                                    {errors.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="single-form button">
                              <button
                                className="btn"
                                onClick={() => {
                                  if (validateStep1()) {
                                    setActiveKey("1");
                                  }
                                }}
                              >
                                الخطوة التالية
                              </button>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        <span className="personal-details">معلومات الشحن</span>
                        <div className="personal-icons">
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="icon-plus"
                          />
                          <FontAwesomeIcon
                            icon={faMinus}
                            className="icon-minus"
                          />
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="single-form form-default">
                              <label>المحافظة</label>
                              <div className="row">
                                <div className="col-md-6 form-input form">
                                  <select
                                    className="form-control"
                                    value={governorate}
                                    onChange={(e) =>
                                      setGovernorate(e.target.value)
                                    }
                                  >
                                    <option value="">اختر المحافظة</option>
                                    {governorates.map((gov) => (
                                      <option key={gov} value={gov}>
                                        {gov}
                                      </option>
                                    ))}
                                  </select>

                                  {errors.governorate && (
                                    <span className="error-text">
                                      {errors.governorate}
                                    </span>
                                  )}
                                </div>
                                <div className="col-md-6 form-input form">
                                  <input
                                    type="text"
                                    placeholder="المدينة أو الحي"
                                    value={formData.city}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        city: e.target.value,
                                      })
                                    }
                                  />

                                  {errors.city && (
                                    <span className="error-text">
                                      {errors.city}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="single-form form-default">
                              <label>العنوان</label>
                              <div className="form-input form">
                                <input
                                  type="text"
                                  placeholder="العنوان الكامل"
                                  value={formData.address}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      address: e.target.value,
                                    })
                                  }
                                />

                                {errors.address && (
                                  <span className="error-text">
                                    {errors.address}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="single-form form-default">
                              <label>رقم البناية</label>
                              <div className="form-input form">
                                <input
                                  type="text"
                                  placeholder="رقم البناية"
                                  value={formData.buildingNumber}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      buildingNumber: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="single-form form-default">
                              <label>ملاحظات إضافية</label>
                              <div className="form-input form">
                                <textarea
                                  placeholder="اكتب ملاحظاتك هنا..."
                                  value={formData.notes}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      notes: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <p className="form-text text-muted mt-3 mb-0 fs-5 text-center">
                              الدفع عند الاستلام
                            </p>
                          </div>

                          <div className="col-md-12">
                            <div className="single-form button">
                              <button
                                className="btn"
                                type="button"
                                onClick={() => {
                                  if (isCartEmpty) {
                                    setSubmitError(
                                      "لا يمكنك إنشاء طلب بدون منتجات في السلة.",
                                    );
                                    return;
                                  }

                                  if (validateStep2()) {
                                    setShowConfirmDialog(true);
                                  }
                                }}
                                disabled={isSubmitting}
                              >
                                {isSubmitting
                                  ? "جاري المعالجة..."
                                  : "إنهاء الطلب"}
                              </button>
                            </div>
                          </div>
                          {showConfirmDialog && (
                            <div className="confirm-dialog mt-4 p-4 bg-white rounded shadow-sm">
                              <h5 className="mb-3">تأكيد الطلب</h5>
                              <p className="mb-2">
                                تأكيد إرسال الطلب إلى {governorate}،{" "}
                                {formData.city}.
                              </p>
                              <p className="mb-3">
                                تكلفة الشحن:{" "}
                                {shippingCost === 0
                                  ? "مجاني"
                                  : `${shippingCost} جنيه`}
                                .
                              </p>
                              <div className="d-flex gap-2 justify-content-end">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => setShowConfirmDialog(false)}
                                >
                                  تعديل
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={handleSubmitOrder}
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting
                                    ? "جاري الإرسال..."
                                    : "تأكيد الطلب"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckoutDetails;
