import { useEffect, useState } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";

function Section({ category, banner }) {
  const [products, setProduct] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((response) => {
        setProduct(response.data);

        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <div className="pt-5 text-center">
        <img src={banner} alt="" className="rounded-3 mb-5 img-fluid" />
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        dir="rtl"
        rtl={true}
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },

          768: {
            slidesPerView: 2,
          },

          992: {
            slidesPerView: 4,
          },
        }}
      >
        {products
          .filter(
            (product) => product.stock > 0 && product.category === category,
          )
          .map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                image={product.image}
                name={product.name}
                category={product.category}
                price={product.price}
                oldPrice={product.old_price}
                discount={product.discount}
                isNew={product.is_new}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}

export default Section;
