import "./CartDetails.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faXmark, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

import { NavLink } from "react-router";

import { useCart } from "./products/layouts/CartContext";

const getItemKey = (item) => item.key ?? `${item.type || "product"}-${item.id}`;
const getItemRoute = (item) =>
  item.type === "offer" ? `/offer/${item.id}` : `/product/${item.id}`;

function CartDetails() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();

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

  const shippingCost = productsTotal >= 2500 ? 0 : 80;

  const finalTotal = productsTotal + shippingCost;

  return (
    <>
      <div className="section shopping-cart" dir="rtl">
        <div className="container">
          <div className="cart-list-head">
            <div className="cart-list-title">
              <div className="row">
                <div className="col-lg-1 col-md-1 col-12"></div>
                <div className="col-lg-4 col-md-3 col-12">
                  <p>اسم المنتج</p>
                </div>
                <div className="col-lg-2 col-md-2 col-12">
                  <p>الكمية</p>
                </div>
                <div className="col-lg-2 col-md-2 col-12">
                  <p>السعر</p>
                </div>
                <div className="col-lg-2 col-md-2 col-12">
                  <p>الخصم</p>
                </div>
                <div className="col-lg-1 col-md-2 col-12">
                  <p></p>
                </div>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-center m-4 fs-5">العربة فارغة</p>
            ) : (
              cartItems.map((item) => (
                <div className="cart-single-list" key={getItemKey(item)}>
                  <div className="row align-items-center">
                    <div className="col-lg-1 col-md-1 col-12">
                      <NavLink
                        to={getItemRoute(item)}
                        state={{ productName: item.title || item.name }}
                      >
                        <img
                          src={`http://127.0.0.1:8000${item.image}`}
                          alt={item.title || item.name}
                        />
                      </NavLink>
                    </div>

                    <div className="col-lg-4 col-md-3 col-12">
                      <h5 className="product-name">
                        <NavLink
                          to={getItemRoute(item)}
                          state={{ productName: item.title || item.name }}
                        >
                          {item.title || item.name}
                        </NavLink>
                      </h5>

                      <p className="product-desc">
                        <NavLink to={""}>
                          <span>
                            <em>الفئة: </em>{" "}
                            {item.category || item.subTitle || "غير محدد"}
                          </span>
                        </NavLink>
                      </p>
                    </div>

                    <div className="col-lg-2 col-md-2 col-12">
                      <div className="btns d-flex align-items-center gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => decreaseQty(getItemKey(item))}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>

                        <div className="quantity-box fw-bold fs-5">
                          {item.quantity}
                        </div>

                        <button
                          className="btn btn-primary"
                          onClick={() => increaseQty(getItemKey(item))}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>

                    <div className="col-lg-2 col-md-2 col-12">
                      <p>{item.price * item.quantity} جنيه</p>
                    </div>

                    <div className="col-lg-2 col-md-2 col-12">
                      <p>
                        {item.oldPrice
                          ? (item.oldPrice - item.price) * item.quantity
                          : 0}{" "}
                        جنيه
                      </p>
                    </div>

                    <div className="col-lg-1 col-md-2 col-12">
                      <button
                        className="remove-item"
                        onClick={() => removeFromCart(getItemKey(item))}
                        style={{ border: "none" }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="row">
            <div className="col-12">
              <div className="total-amount">
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-12">
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
                            {shippingCost === 0
                              ? "مجاني"
                              : `${shippingCost} جنيه`}
                          </span>
                        </li>

                        <li className="fw-bold">
                          المبلغ المستحق:
                          <span>{finalTotal} جنيه</span>
                        </li>
                      </ul>
                      <div className="button">
                        <NavLink className="btn" to="/checkout">
                          الشراء
                        </NavLink>
                        <NavLink className="btn" to={"/all-products"}>
                          الإستمرار في التسوق
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartDetails;
