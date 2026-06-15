import "./FAQContent.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

import Accordion from "react-bootstrap/Accordion";

function FAQContent() {
  return (
    <>
      <div className="faq section" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="container">
          <div className="row">
            <div
              className="col-12"
              style={{ direction: "rtl", textAlign: "right" }}
            >
              <div className="section-title">
                <h2 className="position-relative">
                  لا تزال لديك استفسارات؟
                  <br /> اطرح سؤالك وسنكون سعداء بمساعدتك.
                </h2>
                <p>
                  نقوم بالرد عادةً خلال مدة تصل إلى يومي عمل. وتُعرض الأسئلة
                  الأكثر شيوعًا هنا.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10 col-md-12 col-12 mx-auto">
              <div style={{ direction: "rtl" }}>
                <Accordion defaultActiveKey="0" flush>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <span className="faq-question">
                        ما هي طرق الدفع المتاحة؟
                      </span>
                      <div className="faq-icons">
                        <FontAwesomeIcon icon={faPlus} className="icon-plus" />
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="icon-minus"
                        />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        في الوقت الحالي، نوفر وسيلة دفع واحدة فقط وهي الدفع عند
                        الاستلام، وذلك لتسهيل عملية الشراء وضمان راحة العملاء
                        أثناء التعامل معنا.
                      </p>
                      <p>
                        ونحن نعمل باستمرار على تطوير خدماتنا، لذلك من المتوقع أن
                        يتم إضافة خيارات الدفع الإلكتروني في المستقبل القريب
                        لتوفير مرونة أكبر وتسهيل تجربة الدفع بشكل أكثر سرعة
                        وسلاسة.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      <span className="faq-question">
                        كم تستغرق مدة التوصيل؟
                      </span>
                      <div className="faq-icons">
                        <FontAwesomeIcon icon={faPlus} className="icon-plus" />
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="icon-minus"
                        />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        تختلف مدة التوصيل حسب موقعك الجغرافي وظروف الشحن، ولكن
                        في العادة يتم تسليم الطلبات خلال فترة تتراوح بين يومين
                        إلى خمسة أيام عمل من تاريخ تأكيد الطلب.
                      </p>
                      <p>
                        ونحرص دائمًا على تجهيز الطلبات وشحنها في أسرع وقت ممكن
                        لضمان وصولها إليك بأفضل حالة وفي أقصر مدة ممكنة، مع
                        إبقاء العميل على اطلاع بأي تحديثات تخص حالة الشحن إذا
                        لزم الأمر.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>
                      <span className="faq-question">
                        هل أحتاج إلى إنشاء حساب لإتمام الطلب؟
                      </span>
                      <div className="faq-icons">
                        <FontAwesomeIcon icon={faPlus} className="icon-plus" />
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="icon-minus"
                        />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        لا، لست بحاجة إلى إنشاء حساب من أجل إتمام عملية الشراء.
                        يمكنك بكل سهولة طلب المنتج وإدخال بياناتك المطلوبة أثناء
                        إتمام الطلب.
                      </p>
                      <p>
                        بعد ذلك سيتواصل معك أحد فريقنا لتأكيد تفاصيل الطلب
                        والتأكد من كل البيانات قبل البدء في تجهيز الشحنة، وذلك
                        لضمان دقة الطلب وتقديم أفضل خدمة ممكنة لك دون أي تعقيد.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>
                      <span className="faq-question">
                        هل تقدمون خصومات للعملاء الدائمين؟
                      </span>
                      <div className="faq-icons">
                        <FontAwesomeIcon icon={faPlus} className="icon-plus" />
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="icon-minus"
                        />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        نعم، نحن نُقدّر عملاءنا الدائمين ونحرص على مكافأتهم بشكل
                        مستمر. لذلك قد نوفر عروضًا وخصومات خاصة من وقت لآخر
                        للعملاء الذين يكررون الشراء معنا.
                      </p>
                      <p>
                        كما نعمل دائمًا على تطوير برامج وعروض مميزة تهدف إلى منح
                        العملاء تجربة أفضل وقيمة أكبر مقابل مشترياتهم، لذا يُفضل
                        متابعة تحديثاتنا بشكل دوري لمعرفة أحدث العروض المتاحة.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="4">
                    <Accordion.Header>
                      <span className="faq-question">
                        ما هي شروط استرجاع المنتجات أو استرداد المبلغ؟
                      </span>
                      <div className="faq-icons">
                        <FontAwesomeIcon icon={faPlus} className="icon-plus" />
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="icon-minus"
                        />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        نحرص دائمًا على رضا عملائنا، لذلك نوفر إمكانية استرجاع
                        أو استبدال المنتجات وفقًا لشروط محددة. يمكن طلب
                        الاسترجاع في حال وجود عيب في المنتج أو اختلافه عن
                        المواصفات المتفق عليها عند الطلب.
                      </p>
                      <p>
                        ويُشترط أن يكون المنتج في حالته الأصلية وغير مستخدم، مع
                        الاحتفاظ بعبوته وكافة الملحقات الخاصة به. كما يجب تقديم
                        طلب الاسترجاع خلال فترة زمنية محددة من تاريخ الاستلام.
                      </p>
                      <p>
                        بعد مراجعة الطلب والتأكد من استيفاء الشروط، يتم اتخاذ
                        الإجراء المناسب سواء بالاستبدال أو استرداد المبلغ وفق
                        سياسة المتجر، وذلك لضمان تجربة شراء عادلة ومرضية للجميع.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FAQContent;
