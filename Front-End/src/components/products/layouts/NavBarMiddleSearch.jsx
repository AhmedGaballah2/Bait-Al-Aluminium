import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import NavbarSearchForm from "./NavbarSearchForm";

import api from "../../../services/api";

function NavBarMiddleSearch() {
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
    <>
      <div className="middle-search col-lg-5 col-md-7 d-xs-none w-100">
        <NavbarSearchForm />
      </div>
    </>
  );
}

export default NavBarMiddleSearch;
