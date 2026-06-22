import "./ProductDetailsContent.css";

import { useLocation } from "react-router";
import { useEffect } from "react";

import TopAreaOffer from "./products/layouts/TopAreaOfferDetails";
import MidAreaOfferDetails from "./products/layouts/MidAreaOfferDetails";

function OfferDetailsContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <section className="item-details section">
        <div className="container">
          <TopAreaOffer />
          <MidAreaOfferDetails />
        </div>
      </section>
    </>
  );
}

export default OfferDetailsContent;
