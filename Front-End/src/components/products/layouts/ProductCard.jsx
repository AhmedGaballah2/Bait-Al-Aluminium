import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";

import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

import { NavLink } from "react-router-dom";

import { useCart } from "./CartContext";

import { useState } from "react";

import { getMediaUrl } from "../../../services/api";

function ProductCard({
  image,
  name,
  category,
  price,
  oldPrice,
  isNew,
  discount,
  id,
  averageRating,
  stock,
}) {
  const { addToCart } = useCart();

  const isOutOfStock = !stock || stock <= 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />,
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarHalfStroke}
            className="text-warning"
          />,
        );
      } else {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarRegular}
            className="text-muted"
          />,
        );
      }
    }

    return stars;
  };

  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(
      {
        id,
        type: "product",
        name,
        image,
        price,
        stock,
        oldPrice,
        category,
      },
      1,
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <div className="single-product position-relative">
      <div className="product-image position-relative">
        <NavLink
          to={`/product/${id}`}
          state={{ productName: name }}
          style={{ width: "100%", height: "100%" }}
        >
          <img src={getMediaUrl(image)} alt="#" />
        </NavLink>

        {isOutOfStock && (
          <div
            className="d-flex align-items-center justify-content-center position-absolute"
            style={{
              top: "50%",
              left: 0,
              width: "100%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(220, 53, 69, 0.75)",
              color: "#fff",
              padding: "6px 0",
              fontWeight: "bold",
              zIndex: 2,
            }}
          >
            الكمية غير متوفرة
          </div>
        )}

        <div className="button">
          <button
            className={`btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
            disabled={added || isOutOfStock}
          >
            <FontAwesomeIcon icon={faCartShopping} />

            <span className="me-2">
              {isOutOfStock
                ? "غير متوفر"
                : added
                  ? "تمت الإضافة "
                  : "أضف للعربة"}
            </span>
          </button>
        </div>
      </div>

      <div className="product-info text-end">
        <span className="category">{category}</span>

        <h4 className="title">
          <NavLink to={`/product/${id}`} state={{ productName: name }}>
            {name}
          </NavLink>
        </h4>

        <div className="reviews">
          {renderStars(averageRating)}
          <span className="ms-2 text-muted small">({averageRating})</span>
        </div>

        <div className="price">
          <span style={{ marginLeft: "10px" }}> {price} جنيه</span>
          {oldPrice && (
            <span className="text-muted text-decoration-line-through">
              {oldPrice} جنيه
            </span>
          )}
        </div>
        {discount > 0 && (
          <div
            className="badge rounded-pill text-bg-success position-absolute"
            style={{ top: "10px", right: "10px" }}
          >
            خصم {discount}%
          </div>
        )}
        {isNew && (
          <span
            className="px-2 bg-danger position-absolute"
            style={{ top: "8px", left: "8px", color: "#fff" }}
          >
            جديد
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
