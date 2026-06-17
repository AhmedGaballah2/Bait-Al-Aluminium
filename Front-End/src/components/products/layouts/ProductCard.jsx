import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";

import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

import { NavLink } from "react-router-dom";

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
}) {
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

  return (
    <div className="single-product position-relative">
      <div className="product-image">
        <img src={`http://127.0.0.1:8000${image}`} alt="#" />

        <div className="button">
          <a href="product-details.html" className="btn">
            <i className="lni lni-cart">
              <FontAwesomeIcon icon={faCartShopping} />
            </i>

            <span className="me-2">أضف للعربة</span>
          </a>
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
          <span style={{ marginLeft: "10px" }}>جنيه {price}</span>
          {oldPrice && (
            <span className="text-muted text-decoration-line-through">
              جنيه {oldPrice}
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
