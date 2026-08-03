import "./AllProductsContent.css";
import "rc-slider/assets/index.css";
import ProductCard from "./products/layouts/ProductCard";
import OfferCard from "./products/layouts/OffersCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import api from "../services/api";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Slider from "rc-slider";

const PAGE_SIZE = 12;

function AllProductsContent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  const [priceRange, setPriceRange] = useState([0, 10000]);

  const [selectedPrice, setSelectedPrice] = useState(null);

  // نص البحث المكتوب في خانة السيرش
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  // خيار الترتيب المختار من الـ select
  const [sortOption, setSortOption] = useState("rating");

  // الكاتيجوري المختارة حاليًا (بتتقرأ من الـ URL أول ما الصفحة تفتح)
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || null,
  );

  // عدد العناصر المعروضة حاليًا (يبدأ بـ 12 ويزيد 12 كل مرة)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // بيبقى true لما يكون بيحمّل الدفعة الجاية (لإظهار البريلودر)
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const priceFilters = [
    { id: 1, min: 0, max: 500 },
    { id: 2, min: 500, max: 1000 },
    { id: 3, min: 1000, max: 2000 },
    { id: 4, min: 2000, max: 5000 },
  ];

  const filtersWithCount = priceFilters.map((filter) => ({
    ...filter,
    count: products.filter(
      (product) => product.price >= filter.min && product.price < filter.max,
    ).length,
  }));

  useEffect(() => {
    if (!products.length) return;

    const prices = products.map((product) => product.price);

    const max = Math.max(...prices);

    setMinPrice(0);
    setMaxPrice(max);

    setPriceRange([0, max]);
  }, [products]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes, offersRes] = await Promise.all([
          api.get("/categories/"),
          api.get("/products/"),
          api.get("/offers/"),
        ]);

        setCategories(categoriesRes.data);

        const mappedProducts = productsRes.data.map((p) => ({
          id: p.id,
          image: p.image,
          name: p.name,
          category: p.category,
          price: parseFloat(p.price),
          oldPrice: p.old_price ? parseFloat(p.old_price) : null,
          isNew: p.is_new,
          discount: p.discount,
          averageRating: p.average_rating,
          stock: p.stock,
        }));

        setProducts(mappedProducts);

        // تحويل بيانات العروض القادمة من الـ API لتطابق
        // الـ props اللي بيستنياها OfferCard، وحساب نسبة الخصم
        const mappedOffers = offersRes.data
          .filter((o) => o.is_active)
          .map((o) => {
            const price = parseFloat(o.price);
            const oldPrice = o.old_price ? parseFloat(o.old_price) : null;
            const discount =
              oldPrice && oldPrice > 0
                ? Math.round(((oldPrice - price) / oldPrice) * 100)
                : 0;

            return {
              id: o.id,
              image: o.image,
              title: o.title,
              subTitle: o.subTitle,
              category: o.category,
              price,
              oldPrice,
              discount,
              averageRating: o.average_rating,
              stock: o.stock,
            };
          });

        setOffers(mappedOffers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // كل ما الـ query param بتاع الكاتيجوري يتغير (مثلاً لما الليوزر يدوس
  // على كاتيجوري من الميوّنيو وهو أصلاً في صفحة /all-products)، حدّث الفلتر
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || null);
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  categoryCounts["العروض"] = offers.length;

  const filteredProducts = products.filter((product) => {
    const withinRange =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    if (!withinRange) return false;

    if (selectedPrice) {
      const filter = priceFilters.find((f) => f.id === selectedPrice);
      if (
        filter &&
        !(product.price >= filter.min && product.price < filter.max)
      ) {
        return false;
      }
    }

    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }

    if (
      searchTerm.trim() &&
      !product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const filteredOffers = offers.filter((offer) => {
    const withinRange =
      offer.price >= priceRange[0] && offer.price <= priceRange[1];

    if (!withinRange) return false;

    if (selectedPrice) {
      const filter = priceFilters.find((f) => f.id === selectedPrice);

      if (filter && !(offer.price >= filter.min && offer.price < filter.max)) {
        return false;
      }
    }

    if (selectedCategory && offer.category !== selectedCategory) {
      return false;
    }

    if (
      searchTerm.trim() &&
      !offer.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // ترتيب النتائج حسب الخيار المختار من الـ select
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "name_asc":
        return a.name.localeCompare(b.name, "ar");
      case "name_desc":
        return b.name.localeCompare(a.name, "ar");
      case "rating":
      default:
        return (b.averageRating || 0) - (a.averageRating || 0);
    }
  });

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortOption) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "name_asc":
        return a.title.localeCompare(b.title, "ar");
      case "name_desc":
        return b.title.localeCompare(a.title, "ar");
      case "rating":
      default:
        return (b.averageRating || 0) - (a.averageRating || 0);
    }
  });

  // كل ما الفلاتر أو البحث أو الترتيب تتغير، رجّع عدد العناصر المعروضة لأول 12
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [priceRange, selectedPrice, selectedCategory, searchTerm, sortOption]);

  const isOffersCategory = selectedCategory === "العروض";

  const visibleOffers = sortedOffers.slice(0, visibleCount);

  // العناصر اللي هتتعرض فعليًا في الصفحة
  const visibleProducts = sortedProducts.slice(0, visibleCount);

  // الاستماع لحدث الـ scroll، وإظهار بريلودر لمدة ثانية قبل تحميل 12 عنصر إضافي
  useEffect(() => {
    const handleScroll = () => {
      // لو مفيش عناصر تانية هيتحملوا، أو البريلودر شغال فعلاً، متعملش حاجة
      if (isLoadingMore || visibleCount >= sortedProducts.length) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 300;

      if (scrollPosition >= threshold) {
        setIsLoadingMore(true);

        setTimeout(() => {
          setVisibleCount((prevCount) =>
            Math.min(prevCount + PAGE_SIZE, sortedProducts.length),
          );
          setIsLoadingMore(false);
        }, 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sortedProducts.length, isLoadingMore, visibleCount]);

  // دالة موحّدة لتغيير الكاتيجوري: بتحدّث الـ state وكمان بتحدّث الـ URL
  // عشان لو الليوزر عمل رفريش أو شير اللينك يفضل الفلتر شغال
  const handleCategoryClick = (categoryName) => {
    const isSame = selectedCategory === categoryName;
    setSelectedCategory(isSame ? null : categoryName);

    const newParams = new URLSearchParams(searchParams);
    if (isSame) {
      newParams.delete("category");
    } else {
      newParams.set("category", categoryName);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const newParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  return (
    <section className="product-grids section" dir="rtl">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-12">
            <div className="product-sidebar">
              <div className="single-widget search">
                <h3>ابحث عن المنتج</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    placeholder="ابحث هنا..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button type="submit">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                </form>
              </div>
              <div className="single-widget">
                <h3>جميع الفئات</h3>
                <ul className="list">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <a
                        href="#"
                        className={
                          selectedCategory === category.name ? "active" : ""
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategoryClick(category.name);
                        }}
                      >
                        {category.name} ({categoryCounts[category.name] || 0})
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="single-widget range">
                <h3>نطاق السعر</h3>
                <Slider
                  range
                  reverse
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange}
                  onChange={setPriceRange}
                />

                <div className="range-values">
                  <span>{priceRange[0]} جنيه</span>
                  <span>{priceRange[1]} جنيه</span>
                </div>
              </div>
              <div className="single-widget condition">
                <h3>تصفية حسب السعر</h3>

                <ul className="price-filter-list">
                  {filtersWithCount.map((filter) => (
                    <li key={filter.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedPrice === filter.id}
                          onChange={() =>
                            setSelectedPrice(
                              selectedPrice === filter.id ? null : filter.id,
                            )
                          }
                        />
                        {filter.max === Infinity
                          ? `${filter.min}+ جنيه`
                          : `${filter.min} - ${filter.max} جنيه`}{" "}
                        ({filter.count})
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-12">
            <div className="product-grids-head">
              <div className="product-grid-topbar">
                <div className="row align-items-center">
                  <div className="col-lg-7 col-md-8 col-12">
                    <div className="product-sorting">
                      <label htmlFor="sorting">الترتيب حسب:</label>
                      <select
                        className="form-control"
                        id="sorting"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <option value="rating">الأعلى تقييمًا</option>
                        <option value="price_asc">
                          السعر: من الأقل إلى الأعلى
                        </option>
                        <option value="price_desc">
                          السعر: من الأعلى إلى الأقل
                        </option>
                        <option value="name_asc">
                          الاسم: تصاعديًا (أ - ي)
                        </option>
                        <option value="name_desc">
                          الاسم: تنازليًا (ي - أ)
                        </option>
                      </select>
                      <h3 className="total-show-product">
                        المعروض:{" "}
                        <span>
                          {isOffersCategory
                            ? visibleOffers.length
                            : visibleProducts.length}{" "}
                          من{" "}
                          {isOffersCategory
                            ? sortedOffers.length
                            : sortedProducts.length}{" "}
                          عنصر
                        </span>
                      </h3>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-4 col-12"></div>
                </div>
              </div>
              <div className="tab-content" id="nav-tabContent">
                <div
                  className="tab-pane fade active show"
                  id="nav-grid"
                  role="tabpanel"
                  aria-labelledby="nav-grid-tab"
                >
                  <div className="row">
                    {isOffersCategory
                      ? visibleOffers.map((offer) => (
                          <div
                            className="col-lg-4 col-md-6 col-12"
                            key={offer.id}
                          >
                            <OfferCard {...offer} />
                          </div>
                        ))
                      : visibleProducts.map((product) => (
                          <div
                            className="col-lg-4 col-md-6 col-12"
                            key={product.id}
                          >
                            <ProductCard {...product} />
                          </div>
                        ))}
                  </div>

                  {isLoadingMore && (
                    <div className="products-preloader">
                      <div className="products-preloader-spinner"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AllProductsContent;
