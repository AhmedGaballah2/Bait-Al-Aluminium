import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPhone,
  faMagnifyingGlass,
  faHeart,
  faCartShopping,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../../assets/Logo.webp";

import { useCart } from "./CartContext";

function NavBarMiddle() {
  const { cartItems, removeFromCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <>
      <div className="header-middle">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-3 col-7">
              <NavLink className="navbar-brand" to="/">
                <img src={logo} alt="Logo" />
              </NavLink>
            </div>
            <div className="col-lg-5 col-md-7 d-xs-none">
              <div className="main-menu-search">
                <div className="navbar-search search-style-5">
                  <div className="search-select">
                    <div className="select-position">
                      <select id="select1">
                        <option selected>الكل</option>
                        <option value="1">النوع 01</option>
                        <option value="2">النوع 02</option>
                        <option value="3">النوع 03</option>
                        <option value="4">النوع 04</option>
                        <option value="5">النوع 05</option>
                      </select>
                    </div>
                  </div>
                  <div className="search-input">
                    <input
                      type="text"
                      placeholder="...ابحث"
                      className="text-end"
                    />
                  </div>
                  <div className="search-btn">
                    <button>
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-2 col-5">
              <div className="middle-right-area">
                <div className="nav-hotline">
                  <i className="lni lni-phone d-flex justify-content-center align-items-center">
                    <FontAwesomeIcon icon={faPhone} />
                  </i>

                  <h3>
                    :للتواصل
                    <span>(+20) 101 770 2947</span>
                  </h3>
                </div>
                <div className="navbar-cart">
                  <div className="wishlist">
                    <a
                      href="javascript:void(0)"
                      className="d-flex justify-content-center align-items-center"
                    >
                      <i className="lni lni-heart">
                        <FontAwesomeIcon
                          icon={faHeart}
                          style={{ color: "#081828" }}
                        />
                      </i>
                      <span className="total-items">0</span>
                    </a>
                  </div>
                  <div className="cart-items">
                    <a
                      href="javascript:void(0)"
                      className="main-btn d-flex justify-content-center align-items-center"
                    >
                      <NavLink to={"/cart"}>
                        <i className="lni lni-cart">
                          <FontAwesomeIcon
                            icon={faCartShopping}
                            style={{ color: "#081828" }}
                          />
                        </i>
                      </NavLink>
                      <span className="total-items">{cartItems.length}</span>
                    </a>
                    <div className="shopping-item">
                      <div className="dropdown-cart-header">
                        <span>عدد العناصر: {cartItems.length}</span>
                        <NavLink to={"/cart"}>العربة</NavLink>
                      </div>
                      <ul className="shopping-list">
                        {cartItems.length === 0 ? (
                          <li
                            style={{ padding: "10px" }}
                            className="justify-content-center"
                          >
                            العربة فارغه
                          </li>
                        ) : (
                          cartItems.map((item) => (
                            <li key={item.id}>
                              <a
                                className="remove"
                                onClick={() => removeFromCart(item.id)}
                                style={{ cursor: "pointer" }}
                              >
                                <FontAwesomeIcon icon={faXmark} />
                              </a>

                              <div className="cart-img-head">
                                <img
                                  src={`http://127.0.0.1:8000${item.image}`}
                                  alt=""
                                />
                              </div>

                              <div className="content">
                                <h4 className="text-end">
                                  <NavLink
                                    to={`/product/${item.id}`}
                                    state={{ productName: item.name }}
                                  >
                                    {item.name}
                                  </NavLink>
                                </h4>

                                <p className="quantity text-end">
                                  {item.quantity}x -{" "}
                                  <span className="amount">
                                    {item.price} جنيه
                                  </span>
                                </p>
                              </div>
                            </li>
                          ))
                        )}
                      </ul>
                      <div className="bottom">
                        <div className="total" dir="rtl">
                          <span>الإجمالي:</span>
                          <span className="total-amount">{total} جنيه</span>
                        </div>
                        <div className="button">
                          <a
                            href="checkout.html"
                            className="checkout btn animate"
                          >
                            شراء
                          </a>
                        </div>
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

export default NavBarMiddle;
