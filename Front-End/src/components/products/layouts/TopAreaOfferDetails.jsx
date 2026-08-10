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

function TopAreaOffer() {
  const { addToWishlist, removeFromWishlist, isFavorite } = useWishlist();
  const { addToCart } = useCart();
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`/offers/${id}`).then((response) => {
      setOffer(response.data);
      setMainImage(response.data.image);
    });
  }, [id]);

  useEffect(() => {
    api.get(`/offers/${id}/reviews/`).then((res) => setReviews(res.data));
  }, [id]);

  const increase = () => {
    if (!offer) return;
    setQuantity((prev) => (prev < offer.stock ? prev + 1 : prev));
  };

  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!offer) return;

    addToCart(
      {
        id: offer.id,
        type: "offer",
        name: offer.title,
        title: offer.title,
        image: offer.image,
        price: offer.price,
        stock: offer.stock,
        oldPrice: offer.old_price,
      },
      quantity,
    );

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

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
                  {mainImage && <img src={getMediaUrl(mainImage)} alt="" />}
                </div>
                <div className="images">
                  {offer &&
                    [
                      offer.image,
                      offer.image_2,
                      offer.image_3,
                      offer.image_4,
                      offer.image_5,
                    ]
                      .filter(Boolean)
                      .map((image, index) => (
                        <img
                          key={index}
                          src={getMediaUrl(image)}
                          alt={`offer-${index + 1}`}
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
              <h2 className="title">{offer?.title}</h2>
              <p className="category">
                <FontAwesomeIcon icon={faTags} />
                &nbsp; الفئة: &nbsp;
                <NavLink
                  className="link"
                  to={`/all-products?category=${encodeURIComponent(offer?.category)}`}
                >
                  {offer?.category}
                </NavLink>
              </p>
              <h3 className="price">{offer?.price} جنيه</h3>

              <div className="rating" dir="rtl">
                {renderStars(averageRating)}
                <span className="ms-2 text-muted">
                  ({averageRating.toFixed(1)})
                </span>
              </div>

              <div className="info-text">{offer?.description}</div>
              {offer?.stock <= 5 && (
                <p className="text-danger mt-2 fw-bold">
                  <FontAwesomeIcon icon={faTriangleExclamation} /> متبقي{" "}
                  {offer?.stock} فقط في المخزون
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
                          if (!offer) return;
                          const wishlistItem = {
                            id: offer.id,
                            type: "offer",
                            title: offer.title,
                            name: offer.title,
                            image: offer.image,
                            price: offer.price,
                            stock: offer.stock,
                            oldPrice: offer.old_price,
                          };

                          isFavorite(wishlistItem)
                            ? removeFromWishlist(wishlistItem)
                            : addToWishlist(wishlistItem);
                        }}
                      >
                        {offer && isFavorite({ id: offer.id, type: "offer" })
                          ? "إزالة من المفضلة "
                          : "أضف للمفضلة "}
                        <FontAwesomeIcon
                          icon={faHeart}
                          className={
                            offer && isFavorite({ id: offer.id, type: "offer" })
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
                        disabled={added || (offer?.stock || 0) === 0}
                      >
                        <FontAwesomeIcon icon={faCartShopping} />
                        <span className="me-2">
                          {offer?.stock === 0
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

export default TopAreaOffer;
