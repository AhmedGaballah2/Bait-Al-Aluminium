import { useEffect, useState } from "react";
import { tns } from "tiny-slider";
import "tiny-slider/dist/tiny-slider.css";

import api from "../services/api";

import "../components/Hero.css";

function Hero() {
  const [offers, setOffers] = useState([]);
  const [newArrival, setNewArrival] = useState([]);

  useEffect(() => {
    api
      .get("/products/?is_featured_new_arrival=true")
      .then((res) => setNewArrival(res.data));
  }, []);

  useEffect(() => {
    api.get("/offers/").then((res) => setOffers(res.data));
  }, []);

  useEffect(() => {
    if (!offers.length) return;

    const slider = tns({
      container: ".hero-slider",
      items: 1,
      slideBy: "page",
      autoplay: true,
      controls: true,
      nav: false,
      autoplayButtonOutput: false,
      controlsText: ["❮", "❯"],
    });

    return () => {
      slider.destroy();
    };
  }, [offers]);

  return (
    <section className="hero-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-12 custom-padding-right">
            <div className="slider-head">
              <div className="hero-slider">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="single-slider"
                    style={{
                      backgroundImage: `url(${import.meta.env.VITE_MEDIA_BASE_URL.replace("/api", "")}${offer.image})`,
                    }}
                  >
                    <div className="content">
                      <h2>
                        <span>{offer.subTitle}</span>
                        {offer.title}
                      </h2>

                      <p>{offer.description}</p>

                      <h3 dir="rtl">
                        <span>فقط بـ</span>
                        {offer.price} جنيه
                      </h3>

                      <div className="button">
                        <a href="/all-products" className="btn">
                          تسوق الآن
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-12">
            <div className="row">
              <div className="col-lg-12 col-md-6 col-12 md-custom-padding">
                {newArrival.map((product) => (
                  <div
                    key={product.id}
                    className="hero-small-banner"
                    style={{
                      backgroundImage: `url(${import.meta.env.VITE_MEDIA_BASE_URL.replace("/api", "")}${product.image})`,
                    }}
                  >
                    <div className="content">
                      <h2>
                        <span>منتج جديد</span>
                        {product.name}
                      </h2>
                      <h3 dir="rtl">{product.price} جنيه</h3>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-lg-12 col-md-6 col-12">
                <div className="hero-small-banner style2">
                  <div className="content" dir="rtl">
                    <h2>شحن مجاني! </h2>
                    <p>على الطلبات فوق 2500 جنيه</p>
                    <div className="button">
                      <a className="btn" href="/all-products">
                        تسوق الآن
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
