import "./AboutUsContent.css";

import aboutPhoto from "../assets/about-us/about-us.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faHandshake,
  faBolt,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

import { NavLink } from "react-router";

function AboutUsContent() {
  return (
    <>
      <div
        className="section"
        dir="rtl"
        style={{ backgroundColor: "rgb(249, 249, 249)" }}
      >
        <div className="container w-100">
          <div className="about-us-head">
            <div className="row">
              <div className="col-12">
                <div className="section-head text-center position-relative z-5">
                  <h2 className="position-relative">من نحن؟</h2>
                  <p>
                    نحن فخورون بتقديم تشكيلة واسعة من المنتجات التي تلبي
                    احتياجات كل منزل، بدءًا من أواني الطهي والأدوات المطبخية
                    وحتى الإكسسوارات المنزلية التي تضيف لمسة جمالية وفعالية إلى
                    يومك.
                  </p>
                  <a href="#" className="btn px-5">
                    تسوق الآن
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="our-story section" dir="rtl">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 col-12">
              <div className="content-right text-center">
                <h2>قصتنا</h2>
                <h5>
                  لأن التفاصيل الصغيرة تصنع الفرق، نوفر لك منتجات منزلية عملية
                  وعصرية تجعل حياتك اليومية أسهل وأكثر راحة.
                </h5>
                <p>
                  انطلقت فكرة متجرنا من إيماننا بأن المنزل المريح يبدأ من
                  الأدوات المناسبة. لذلك نسعى إلى توفير مجموعة متنوعة من الأدوات
                  المنزلية والمطبخية التي تجمع بين الجودة العالية والتصميم
                  العملي، لتلبية احتياجات كل منزل بأسعار مناسبة. نحرص على اختيار
                  منتجاتنا بعناية لضمان تقديم حلول تساعدك في إنجاز مهامك اليومية
                  بسهولة، مع تجربة تسوق مريحة وآمنة تجعل الوصول إلى ما تحتاجه
                  أسرع وأبسط من أي وقت مضى.
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-12">
              <div className="content-left">
                <img src={aboutPhoto} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="values section"
        dir="rtl"
        style={{ backgroundColor: "rgb(249, 249, 249)" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-head text-center position-relative z-5">
                <h2 className="position-relative">قيمنا</h2>
                <p>
                  نسعى إلى بناء تجربة تسوق موثوقة من خلال الالتزام بالجودة
                  والشفافية والاهتمام باحتياجات عملائنا في كل خطوة.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 col-12">
              <ValueCard
                icon={faStar}
                title={"الجوده"}
                desc={
                  "نحرص على اختيار منتجات عملية وموثوقة بعناية، لتقديم مستوى من الجودة يلبي احتياجات منزلك اليومية."
                }
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <ValueCard
                icon={faHandshake}
                title={"الثقة"}
                desc={
                  "نبني علاقتنا مع عملائنا على الشفافية والمصداقية، لأن الثقة هي أساس كل تجربة تسوق ناجحة."
                }
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <ValueCard
                icon={faBolt}
                title={"السرعة"}
                desc={
                  "نعمل باستمرار على تسهيل تجربة الشراء وتوفير خدمة سريعة تضمن وصول احتياجاتك بأفضل صورة ممكنة."
                }
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <ValueCard
                icon={faHeart}
                title={"رضا العملاء"}
                desc={
                  "نضع احتياجات عملائنا في مقدمة أولوياتنا، ونسعى دائمًا لتقديم تجربة تسوق مريحة ومميزة في كل خطوة."
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="section" dir="rtl">
        <div className="container">
          <div className="row">
            <div className="shopping col-12 text-center">
              <h2>جاهز للتسوق؟</h2>
              <h4>تصفح منتاجتنا واكتشف الأفضل الذي يناسبك.</h4>
              <div className="btns d-flex justify-content-center align-items-center gap-3">
                <a className="btn">تصفح المنتجات</a>
                <NavLink to={"/contact-us"} className="btn">
                  تواصل معنا
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="single-value">
      <div className="icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="content">
        <div className="info">
          <h3>{title}</h3>
          <h5>{desc}</h5>
        </div>
      </div>
    </div>
  );
}

export default AboutUsContent;
