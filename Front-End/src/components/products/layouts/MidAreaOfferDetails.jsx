import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faMarker, faClose } from "@fortawesome/free-solid-svg-icons";

import AnonymousUser from "../../../assets/product-details/anonymous-user.webp";

function MidAreaOfferDetails() {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/offers/${id}`)
      .then((response) => {
        setOffer(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/offers/${id}/reviews/`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const submitReview = (e) => {
    e.preventDefault();

    axios
      .post(`http://127.0.0.1:8000/api/offers/${id}/reviews/`, formData)
      .then((res) => {
        setReviews([res.data, ...reviews]);
        setShowModal(false);
        setFormData({ name: "", email: "", rating: 5, comment: "" });
      })
      .catch((err) => console.log(err));
  };

  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((r) => {
    ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
  });

  const total = reviews.length;
  const average =
    total > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)
      : 0;

  return (
    <>
      <div className="product-details-info" dir="rtl">
        <div className="single-block">
          <div className="row">
            <div className="col-lg-6 col-12">
              <div className="info-body custom-responsive-margin">
                <h4>تفاصيل العرض</h4>
                <p>{offer?.price_details || offer?.description}</p>

                <h4>مميزات العرض</h4>
                <ul className="features">
                  {offer?.features
                    ?.split(/\r?\n/)
                    .filter((item) => item.trim())
                    .map((item, index) => (
                      <li key={index}>
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="info-body">
                <h4>مواصفات العرض</h4>
                <ul className="features">
                  {offer?.specs
                    ?.split(/\r?\n/)
                    .filter((item) => item.trim())
                    .map((item, index) => (
                      <li key={index}>
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>

                <h4>تفاصيل الشحن</h4>
                <ul className="normal-list">
                  <li>
                    تجهيز الطلب: <span> خلال 24 – 48 ساعة قبل الشحن</span>
                  </li>
                  <li>
                    التوصيل: <span>3 - 5 أيام عمل</span>
                  </li>
                  <li>
                    التغطية: <span>جميع محافظات مصر</span>
                  </li>
                  <li>
                    سعر الشحن:{" "}
                    <span>
                      120 جنيه (محافظات الصعيد وسيناء) / 80 جنيه (باقي
                      المحافظات)
                    </span>
                  </li>
                  <li>
                    الشحن المجاني: <span>للطلبات فوق 2500 جنيه</span>
                  </li>
                  <li>
                    الدفع: <span>عند الاستلام</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-12">
            <div className="single-block give-review">
              <h4>
                التقييم الكلي: {average} / 5 ({total} مراجعة)
              </h4>

              <ul>
                {[5, 4, 3, 2, 1].map((star) => (
                  <li key={star}>
                    <span>
                      {star} نجوم - ({ratingCounts[star] || 0})
                    </span>
                    &nbsp;
                    {[...Array(star)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} />
                    ))}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="btn review-btn"
                onClick={() => setShowModal(true)}
              >
                إضافة مراجعه &nbsp; <FontAwesomeIcon icon={faMarker} />
              </button>
            </div>
          </div>
          <div className="col-lg-8 col-12">
            <div className="single-block">
              <div className="reviews">
                <h4 className="title">آخر المراجعات</h4>
                {reviews.length === 0 ? (
                  <p>لا توجد مراجعات بعد</p>
                ) : (
                  reviews.map((review) => {
                    const date = new Date(review.created_at);
                    const formattedDate = `${date.getDate()} ${date.toLocaleString("ar-EG", { month: "long" })}, ${date.getFullYear()}`;
                    return (
                      <div className="single-review" key={review.id}>
                        <img src={AnonymousUser} alt="" />
                        <div className="review-info">
                          <h4>
                            {review.name}
                            <span>{formattedDate}</span>
                          </h4>
                          <ul className="stars">
                            {[...Array(review.rating)].map((_, i) => (
                              <li key={i}>
                                <FontAwesomeIcon icon={faStar} />
                              </li>
                            ))}
                          </ul>
                          <p>{review.comment}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="review-modal-overlay"
          dir="rtl"
          onClick={() => setShowModal(false)}
        >
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-header">
              <h4>إضافة مراجعة</h4>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faClose} />
              </button>
            </div>
            <div className="divider"></div>
            <form className="review-form" onSubmit={submitReview}>
              <div className="row">
                <div className="col-md-6">
                  <label>الإسم</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label>البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mt-3">
                  <label>التقييم</label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: Number(e.target.value),
                      })
                    }
                  >
                    <option value={5}>5 نجوم</option>
                    <option value={4}>4 نجوم</option>
                    <option value={3}>3 نجوم</option>
                    <option value={2}>2 نجوم</option>
                    <option value={1}>1 نجوم</option>
                  </select>
                </div>
                <div className="col-12 mt-3">
                  <label>المراجعة</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>

              <div className="review-footer">
                <button type="submit" className="btn">
                  إضافة المراجعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MidAreaOfferDetails;
