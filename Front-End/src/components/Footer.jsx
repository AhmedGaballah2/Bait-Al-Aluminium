import "./Footer.css";

import FooterTop from "./products/layouts/FooterTop";
import FooterMiddle from "./products/layouts/FooterMiddle";
import FooterBottom from "./products/layouts/FooterBottom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <FooterTop />
        </div>
      </div>
      <FooterMiddle />
      <FooterBottom />
    </footer>
  );
}

export default Footer;
