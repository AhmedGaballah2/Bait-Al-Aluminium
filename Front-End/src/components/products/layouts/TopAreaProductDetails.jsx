import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTags,
  faPlus,
  faMinus,
  faTriangleExclamation,
  faCartShopping,
  faHeart,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";

import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

import { NavLink, useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";

function TopArea() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const [quantity, setQuantity] = useState(1);

  const increase = () => {
    setQuantity((prev) => (prev < product.stock ? prev + 1 : prev));
  };

  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}/reviews/`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

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
    <>
      <div className="top-area">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 col-12">
            <div className="product-images">
              <main id="gallery">
                <div className="main-img">
                  {product && (
                    <img
                      src={`http://127.0.0.1:8000${product?.image}`}
                      alt=""
                    />
                  )}
                </div>
                <div className="images">
                  {product && (
                    <img
                      src={`http://127.0.0.1:8000${product?.image}`}
                      alt=""
                    />
                  )}
                  {product && (
                    <img
                      src={`http://127.0.0.1:8000${product?.image}`}
                      alt=""
                    />
                  )}
                  {product && (
                    <img
                      src={`http://127.0.0.1:8000${product?.image}`}
                      alt=""
                    />
                  )}
                  {product && (
                    <img
                      src={`http://127.0.0.1:8000${product?.image}`}
                      alt=""
                    />
                  )}
                  {product && (
                    <img
                      src={`http://127.0.0.1:8000${product?.image}`}
                      alt=""
                    />
                  )}
                </div>
              </main>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-12" dir="rtl">
            <div className="product-info">
              <h2 className="title">{product?.name}</h2>
              <p className="category">
                <FontAwesomeIcon icon={faTags} />
                &nbsp; الفئة: &nbsp;
                <NavLink className="link">{product?.category}</NavLink>
              </p>
              <h3 className="price">
                {product?.price} جنيه &nbsp;
                <span>{product?.old_price} جنيه</span>
              </h3>

              <div className="rating" dir="rtl">
                {renderStars(averageRating)}
                <span className="ms-2 text-muted">
                  ({averageRating.toFixed(1)})
                </span>
              </div>

              <div className="info-text">{product?.description}</div>
              {product?.stock <= 5 && (
                <p className="text-danger mt-2 fw-bold">
                  <FontAwesomeIcon icon={faTriangleExclamation} /> متبقي{" "}
                  {product?.stock} فقط في المخزون
                </p>
              )}
              <div className="bottom-content">
                <div className="row align-items-center">
                  <div className="col-lg-4 col-md-4 col-12">
                    <div className="btns d-flex align-items-center gap-2">
                      <button className="btn btn-primary" onClick={decrease}>
                        <FontAwesomeIcon icon={faMinus} />
                      </button>

                      <div className="quantity-box fw-bold fs-5">
                        {quantity}
                      </div>
                      <button className="btn btn-primary" onClick={increase}>
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12">
                    <div className="wish-button">
                      <button className="btn">
                        أضف للمفضلة <FontAwesomeIcon icon={faHeart} />
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12">
                    <div className="button cart-button">
                      <button className="btn" style={{ width: "100%" }}>
                        أضف للعربة <FontAwesomeIcon icon={faCartShopping} />
                      </button>
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

export default TopArea;
