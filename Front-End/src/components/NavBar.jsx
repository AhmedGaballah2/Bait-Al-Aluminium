import NavBarTop from "../components/products/layouts/NavBarTop";
import NavBarMiddle from "../components/products/layouts/NavBarMiddle";
import NavBarMiddleSearch from "../components/products/layouts/NavBarMiddleSearch";
import NavBarBottom from "../components/products/layouts/NavBarBottom";
import PageTitler from "./products/layouts/PageTitler";

import "./NavBar.css";

import { useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <header className="header navbar-area">
        <NavBarTop />
        <NavBarMiddle />
        <NavBarMiddleSearch />
        <NavBarBottom />
      </header>

      {!isHomePage && <PageTitler />}
    </>
  );
}

export default NavBar;
