import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";

import api from "../../../services/api";

function RelatedProducts() {
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/products/${id}/related/`)
      .then((res) => setRelatedProducts(res.data));
  }, [id]);

  return (
    <div className="container mb-5">
      <Swiper
        modules={[Navigation]}
        navigation
        dir="rtl"
        rtl={true}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 4 },
        }}
      >
        {relatedProducts.map((product) => (
          <SwiperSlide>
            <ProductCard
              image={product.image}
              name={product.name}
              category={product.category}
              price={product.price}
              oldPrice={product.old_price}
              discount={product.discount}
              isNew={product.is_new}
              id={product.id}
              averageRating={product.average_rating}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default RelatedProducts;
