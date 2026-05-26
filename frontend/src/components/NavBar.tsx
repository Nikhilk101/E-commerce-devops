import { Link, useLocation } from "react-router-dom";

import { useCart } from "../state/CartContext";

export default function NavBar() {
  const { count } = useCart();
  const location = useLocation();

  const isActive = (path: string) => path === location.pathname;

  return (
    <div className="navWrap">
      <div className="container">
        <nav className="navInner">
          <Link to="/" className="brand">
            <span className="brandBadge" aria-hidden="true" />
            TeeStore
          </Link>

          <div className="navLinks">
            <Link to="/" className={`navLink ${isActive("/") ? "navLinkActive" : ""}`}>
              Home
            </Link>
            <Link to="/men" className={`navLink ${isActive("/men") ? "navLinkActive" : ""}`}>
              Men
            </Link>
            <Link to="/women" className={`navLink ${isActive("/women") ? "navLinkActive" : ""}`}>
              Women
            </Link>
            <Link
              to="/products"
              className={`navLink ${isActive("/products") ? "navLinkActive" : ""}`}
            >
              Products
            </Link>
          </div>

          <div className="navRight">
            <Link to="/cart" className="pill">
              <span className="pillDot" aria-hidden="true" />
              Cart ({count})
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

