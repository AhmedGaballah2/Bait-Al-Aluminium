import "./Shipping.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruckFast,
  faHeadset,
  faRotateRight,
  faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons";

function Shipping() {
  return (
    <>
      <section className="shipping-info">
        <div className="container">
          <ul>
            <li>
              <ShippingCard
                title="شحن مجاني"
                desc="على الطلبات التي تزيد قيمتها عن 500 جنيه"
                icon={faTruckFast}
              />
            </li>
            <li>
              <ShippingCard
                icon={faHeadset}
                title="خدمة ٢٤ ساعة"
                desc="تواصل معنا عبر الدردشة المباشرة أو الاتصال"
              />
            </li>
            <li>
              <ShippingCard
                icon={faHandHoldingDollar}
                title="الدفع عند الاستلام"
                desc="تجربة شراء مريحة بدون دفع مسبق"
              />
            </li>
            <li>
              <ShippingCard
                icon={faRotateRight}
                title="إرجاع سهل"
                desc="إرجاع واستبدال بدون أي تعقيدات"
              />
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}

function ShippingCard({ title, desc, icon }) {
  return (
    <>
      <div className="media-icon">
        <i className="lni lni-delivery">
          <FontAwesomeIcon icon={icon} />
        </i>
      </div>
      <div className="media-body">
        <h5>{title}</h5>
        <span>{desc}</span>
      </div>
    </>
  );
}

export default Shipping;
