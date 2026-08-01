import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "الرئيسية",
      "/all-products": "جميع المنتجات",
      "/cart": "العربة",
      "/about": "من نحن؟",
      "/contact-us": "تواصل معنا",
      "/faq": "اسألة متكررة",
      "/fav": "المفضلة",
      "/checkout": "الشراء",
      "/checkout/success": "تم تسجيل طلبك",
      "/mail-success": "تم إرسال بريدك ",
    };

    const pageTitle = titles[location.pathname] || "Page";

    document.title = `بيت الألومنيوم - ${pageTitle}`;
  }, [location.pathname]);

  return null;
}

export default PageTitle;
