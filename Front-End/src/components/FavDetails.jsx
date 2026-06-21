import "./FavDetails.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faXmark, faCartShopping } from "@fortawesome/free-solid-svg-icons";

import { NavLink } from "react-router";

import { useWishlist } from "./products/layouts/WishlistContext";
import { useCart } from "./products/layouts/CartContext";

import { useState } from "react";

function FavDetials() {
  const { wishlist, removeFromWishlist } = useWishlist();

  const { addToCart } = useCart();

  const [addedId, setAddedId] = useState(null);

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
                <div className="cart-single-list" key={item.id}>
                  <div className="row align-items-center">
                    <div className="col-lg-1 col-md-1 col-12">
                      <NavLink
                        to={`/product/${item.id}`}
                        state={{ productName: item.name }}
                      >
                        <img
                          src={`http://127.0.0.1:8000${item.image}`}
                          alt={item.name}
                        />
                      </NavLink>
                    </div>

                    <div className="col-lg-4 col-md-3 col-12">
                      <h5 className="product-name">
                        <NavLink
                          to={`/product/${item.id}`}
                          state={{ productName: item.name }}
                        >
                          {item.name}
                        </NavLink>
                      </h5>

                      <p className="product-desc">
                        <NavLink to={""}>
                          <span>
                            <em>الفئة: </em> {item.category || "غير محدد"}
                          </span>
                        </NavLink>
                      </p>
                    </div>

                    <div className="col-lg-2 col-md-2 col-12">
                      <p>{item.price} جنيه</p>
                    </div>

                    <div className="col-lg-2 col-md-2 col-12">
                      <p>
                        {item.old_price
                          ? item.old_price - item.price + " جنيه"
                          : "0 جنيه"}
                      </p>
                    </div>

                    <div className="col-lg-2 col-md-2 col-12">
                      <button
                        className={`btn ${addedId === item.id ? "added" : ""}`}
                        onClick={() => {
                          addToCart(
                            {
                              id: item.id,
                              name: item.name,
                              image: item.image,
                              price: item.price,
                              stock: item.stock,
                              oldPrice: item.old_price,
                              category: item.category,
                            },
                            1,
                          );

                          setAddedId(item.id);

                          setTimeout(() => {
                            setAddedId(null);
                          }, 2000);
                        }}
                        disabled={addedId === item.id}
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
                        onClick={() => removeFromWishlist(item.id)}
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
