import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function NavBarMiddleSearch() {
  return (
    <>
      <div className="middle-search col-lg-5 col-md-7 d-xs-none w-100">
        <div className="main-menu-search">
          <div className="navbar-search search-style-5">
            <div className="search-select">
              <div className="select-position">
                <select id="select1">
                  <option selected>الكل</option>
                  <option value="1">النوع 01</option>
                  <option value="2">النوع 02</option>
                  <option value="3">النوع 03</option>
                  <option value="4">النوع 04</option>
                  <option value="5">النوع 05</option>
                </select>
              </div>
            </div>
            <div className="search-input">
              <input type="text" placeholder="...ابحث" className="text-end" />
            </div>
            <div className="search-btn">
              <button>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBarMiddleSearch;
