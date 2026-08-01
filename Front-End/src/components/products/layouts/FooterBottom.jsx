import payment from "../../../assets/payment.webp";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FooterBottom() {
  return (
    <>
      <div className="footer-bottom">
        <div className="container">
          <div className="inner-content">
            <div className="row align-items-center" dir="rtl">
              <div className="col-lg-4 col-12">
                <div className="payment-gateway">
                  <span>قريبا: </span>
                  <img src={payment} alt="#" />
                </div>
              </div>
              <div className="col-lg-4 col-12">
                <div className="copyright">
                  <p>
                    تم التصميم والتطوير عن طريق: &nbsp;
                    <a
                      href="https://www.linkedin.com/in/AhmedGaballah2"
                      rel="nofollow"
                      target="_blank"
                    >
                      أحمد جاب الله
                    </a>
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-12">
                <ul className="socila">
                  <li>
                    <span>تابعنا: &nbsp;</span>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/profile.php?id=100088477002335"
                      target="_blank"
                    >
                      <i className="lni lni-facebook-filled">
                        <FontAwesomeIcon icon={faFacebook} />
                      </i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/_aluminum_home/"
                      target="_blank"
                    >
                      <i className="lni lni-twitter-original">
                        <FontAwesomeIcon icon={faInstagram} />
                      </i>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)">
                      <i className="lni lni-instagram">
                        <FontAwesomeIcon icon={faWhatsapp} />
                      </i>
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0)">
                      <i className="lni lni-google">
                        <FontAwesomeIcon icon={faTelegram} />
                      </i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FooterBottom;
