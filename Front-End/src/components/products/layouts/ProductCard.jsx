import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

function ProductCard({
  image,
  name,
  category,
  price,
  oldPrice,
  isNew,
  discount,
}) {
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
          <a href="#">{name}</a>
        </h4>

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
