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

import { useEffect, useState } from "react";

import { useCart } from "./CartContext";

import { useWishlist } from "./WishlistContext";

import api from "../../../services/api";

import { getMediaUrl } from "../../../services/api";

function TopArea() {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;

    addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        stock: product.stock,
        oldPrice: product.old_price,
        category: product.category,
      },
      quantity,
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const { addToWishlist, removeFromWishlist, isFavorite } = useWishlist();

  const { addToCart } = useCart();

  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    api.get(`/products/${id}`).then((response) => {
      setProduct(response.data);
      setMainImage(response.data.image);
    });
  }, [id]);

  const [quantity, setQuantity] = useState(1);

  const increase = () => {
    setQuantity((prev) => (prev < product?.stock ? prev + 1 : prev));
  };

  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`/products/${id}/reviews/`).then((res) => setReviews(res.data));
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

  const isOutOfStock = product && (!product.stock || product.stock <= 0);

  return (
    <>
      <div className="top-area">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 col-12">
            <div className="product-images">
              <main id="gallery">
                <div className="main-img">
                  {mainImage && <img src={getMediaUrl(mainImage)} alt="" />}
                </div>
                <div className="images">
                  {product &&
                    [
                      product.image,
                      product.image_2,
                      product.image_3,
                      product.image_4,
                      product.image_5,
                    ]
                      .filter(Boolean)
                      .map((image, index) => (
                        <img
                          key={index}
                          src={getMediaUrl(image)}
                          alt={`product-${index + 1}`}
                          onClick={() => setMainImage(image)}
                          className={mainImage === image ? "active" : ""}
                        />
                      ))}
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
                <NavLink
                  className="link"
                  to={`/all-products?category=${encodeURIComponent(product?.category)}`}
                >
                  {product?.category}
                </NavLink>
              </p>
              <h3 className="price">
                {product?.price} جنيه &nbsp;
                <span className="old-price">{product?.old_price} جنيه</span>
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
                      <button
                        className="btn"
                        onClick={() => {
                          if (!product) return;
                          const wishlistItem = {
                            ...product,
                            type: "product",
                            name: product.name,
                            oldPrice: product.old_price,
                          };

                          isFavorite(wishlistItem)
                            ? removeFromWishlist(wishlistItem)
                            : addToWishlist(wishlistItem);
                        }}
                      >
                        {product &&
                        isFavorite({ id: product.id, type: "product" })
                          ? "إزالة من المفضلة "
                          : "أضف للمفضلة "}

                        <FontAwesomeIcon
                          icon={faHeart}
                          className={
                            product &&
                            isFavorite({ id: product.id, type: "product" })
                              ? "text-danger"
                              : ""
                          }
                        />
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12">
                    <div className="button cart-button">
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
