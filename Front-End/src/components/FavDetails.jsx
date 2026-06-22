import "./FavDetails.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faXmark, faCartShopping } from "@fortawesome/free-solid-svg-icons";

import { NavLink } from "react-router";

import { useWishlist } from "./products/layouts/WishlistContext";
import { useCart } from "./products/layouts/CartContext";

import { useState } from "react";

const getItemKey = (item) => item.key ?? `${item.type || "product"}-${item.id}`;
const getItemRoute = (item) =>
  item.type === "offer" ? `/offer/${item.id}` : `/product/${item.id}`;

function FavDetials() {
  const { wishlist, removeFromWishlist } = useWishlist();

  const { addToCart } = useCart();

  const [addedId, setAddedId] = useState(null);

  const getAddedId = (item) =>
    item.key ?? `${item.type || "product"}-${item.id}`;

  return (
    <>
      <div className="section fav" dir="rtl">
        <div className="container">
          <div className="cart-list-head">
            <div className="cart-list-title">
              <div className="row">
                <div className="col-lg-1 col-md-1 col-12"></div>
                <div className="col-lg-4 col-md-3 col-12">
                  <p>اسم المنتج</p>
                </div>
                <div className="col-lg-2 col-md-2 col-12">
                  <p>السعر</p>
                </div>

                <div className="col-lg-2 col-md-2 col-12">
                  <p>الخصم</p>
                </div>
                <div className="col-lg-2 col-md-2 col-12">
                  <p>إضافة للعربة</p>
                </div>
                <div className="col-lg-1 col-md-2 col-12">
                  <p></p>
                </div>
              </div>
            </div>

            {wishlist.length === 0 ? (
              <p className="text-center m-4 fs-5">المفضلة فارغة</p>
            ) : (
              wishlist.map((item) => (
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
                      <p>{item.price} جنيه</p>
                    </div>

                    <div className="col-lg-2 col-md-2 col-12">
                      <p>
                        {item.oldPrice || item.old_price
                          ? (item.oldPrice || item.old_price) -
                            item.price +
                            " جنيه"
                          : "0 جنيه"}
                      </p>
                    </div>

                    <div className="col-lg-2 col-md-2 col-12">
                      <button
                        className={`btn ${addedId === getAddedId(item) ? "added" : ""}`}
                        onClick={() => {
                          addToCart(
                            {
                              id: item.id,
                              type: item.type || "product",
                              name: item.title || item.name,
                              title: item.title || item.name,
                              image: item.image,
                              price: item.price,
                              stock: item.stock,
                              oldPrice: item.oldPrice || item.old_price,
                              category: item.category,
                            },
                            1,
                          );

                          setAddedId(getAddedId(item));

                          setTimeout(() => {
                            setAddedId(null);
                          }, 2000);
                        }}
                        disabled={addedId === getAddedId(item)}
                      >
                        <FontAwesomeIcon icon={faCartShopping} />

                        <span className="me-2">
                          {addedId === item.id ? "تمت الإضافة" : "أضف للعربة"}
                        </span>
                      </button>
                    </div>

                    <div className="col-lg-1 col-md-2 col-12">
                      <button
                        className="remove-item"
                        onClick={() => removeFromWishlist(item)}
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
        </div>
      </div>
    </>
  );
}

export default FavDetials;
