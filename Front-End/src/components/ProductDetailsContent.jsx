import "./ProductDetailsContent.css";

import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import TopArea from "./products/layouts/TopAreaProductDetails";
import MidArea from "./products/layouts/MidAreaProductDetails";
import RelatedProducts from "./products/layouts/RelatedProducts";

import api from "../services/api";

function ProductDetailsContent() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then((response) => {
      setProduct(response.data);
    });
  }, [id]);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <section className="item-details section">
        <div className="container">
          <TopArea />
          <MidArea />
        </div>
      </section>

      <section className="related section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h2 className="wow fadeInUp">منتجات ذات صلة</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
      <RelatedProducts />
    </>
  );
}

export default ProductDetailsContent;
