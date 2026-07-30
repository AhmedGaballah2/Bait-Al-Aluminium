import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import api from "../../../services/api"; // عدّل المسار حسب مكان الملف

function NavbarSearchForm() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchTerm.trim() !== "") {
      params.set("search", searchTerm.trim());
    }

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    navigate(`/all-products?${params.toString()}`);
  };

  return (
    <div className="main-menu-search">
      <form className="navbar-search search-style-5" onSubmit={handleSearch}>
        <div className="search-select">
          <div className="select-position">
            <select
              dir="rtl"
              id="select1"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">الكل</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="search-input">
          <input
            dir="rtl"
            type="text"
            placeholder="ابحث..."
            className="text-end"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="search-btn">
          <button type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default NavbarSearchForm;
