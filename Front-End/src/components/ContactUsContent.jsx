import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapLocationDot,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

import emailjs from "@emailjs/browser";
import { useState, useRef } from "react";

import "./ContactUsContent.css";

function ContactUsContent() {
  const form = useRef();
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .sendForm(
        "service_nz8udlc",
        "template_n5mnp0a",
        form.current,
        "_TUboaxiZBFWKs0Qg",
      )
      .then(
        () => {
          setStatus("success");
          form.current.reset();
        },
        (error) => {
          console.error(error);
          setStatus("error");
        },
      );
  };

  return (
    <div className="section" dir="rtl">
      <div className="container w-100">
        <div className="contact-head">
          <div className="row">
            <div className="col-12">
              <div className="section-head text-center position-relative z-5">
                <h2 className="position-relative">تواصل معنا</h2>
                <p>
                  يسرنا تواصلكم معنا في أي وقت، حيث يحرص فريقنا المتخصص على
                  الاستجابة السريعة لجميع استفساراتكم وتقديم كافة سبل الدعم
                  والمساعدة التي تحتاجونها. نتطلع دائمًا لخدمتكم وتلبية
                  احتياجاتكم على أفضل وجه ممكن.
                </p>
              </div>
            </div>
          </div>
          <div className="contact-info">
            <div className="row">
              <div className="col-lg-4 col-md-12 col-12">
                <div className="single-info-head">
                  <ContactCard
                    icon={faMapLocationDot}
                    title={"العنوان"}
                    detail1={"ش التلواني - الشهداء - المنوفية - مصر"}
                  />
                  <ContactCard
                    icon={faPhone}
                    title={"تواصلوا معنا على الرقم"}
                    detail1={"01017702947"}
                  />
                  <ContactCard
                    icon={faEnvelope}
                    title={"تواصلوا عبر البريد الإلكتروني"}
                    detail1={"agaballah223@gmail.com"}
                    detail2={"galilio2001@gmail.com"}
                  />
                </div>
              </div>
              <div className="col-lg-8 col-md-12 col-12">
                <div className="contact-form-head">
                  <div className="form-main">
                    <form ref={form} className="form" onSubmit={sendEmail}>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-12">
                          <div className="form-group">
                            <input
                              name="name"
                              type="text"
                              placeholder="الإسم بالكامل"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12">
                          <div className="form-group">
                            <input
                              name="subject"
                              type="text"
                              placeholder="الموضوع"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12">
                          <div className="form-group">
                            <input
                              name="email"
                              type="email"
                              placeholder="البريد الإلكتروني"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12">
                          <div className="form-group">
                            <input
                              name="phone"
                              type="text"
                              placeholder="رقم الهاتف المحمول"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group message">
                            <textarea
                              name="message"
                              placeholder="رسالتك"
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group button">
                            <button
                              className="btn"
                              type="submit"
                              disabled={status === "sending"}
                            >
                              {status === "sending"
                                ? "جاري الإرسال..."
                                : "إرسال"}
                            </button>
                          </div>
                        </div>
                        {status === "success" && (
                          <div className="col-12">
                            <p
                              className="success-msg mt-3"
                              style={{ fontSize: "18px" }}
                            >
                              تم إرسال رسالتك بنجاح، شكرًا لتواصلك معنا!
                            </p>
                          </div>
                        )}
                        {status === "error" && (
                          <div className="col-12">
                            <p className="error-msg">
                              حدث خطأ، حاول مرة أخرى أو تواصل معنا عبر البريد
                              الإلكتروني مباشرة.
                            </p>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, detail1, detail2 }) {
  return (
    <>
      <div className="single-info">
        <FontAwesomeIcon icon={icon} className="icon" />
        <h3>{title}</h3>
        <ul>
          <li>{detail1}</li>
          <li>{detail2}</li>
        </ul>
      </div>
    </>
  );
}

export default ContactUsContent;
