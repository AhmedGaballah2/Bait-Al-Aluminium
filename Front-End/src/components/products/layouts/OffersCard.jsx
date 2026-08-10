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

function OfferCard({
  image,
  title,
  category,
  price,
  oldPrice,
  discount,
  id,
  averageRating,
  stock,
}) {
  const { addToCart } = useCart();

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
    addToCart(
      {
        id,
        type: "offer",
        name: title,
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
      <div className="product-image offer-image">
        <NavLink
          to={`/offer/${id}`}
          state={{ offerName: title }}
          style={{ width: "100%", height: "100%" }}
        >
          <img src={getMediaUrl(image)} alt="#" />
        </NavLink>

        <div className="button">
          <button
            className={`btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
            disabled={added}
          >
            <FontAwesomeIcon icon={faCartShopping} />

            <span className="me-2">
              {added ? "تمت الإضافة " : "أضف للعربة"}
            </span>
          </button>
        </div>
      </div>

      <div className="product-info text-end">
        <span className="category">{category}</span>

        <h4 className="title">
          <NavLink to={`/offer/${id}`} state={{ offerName: title }}>
            {title}
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
      </div>
    </div>
  );
}

export default OfferCard;
