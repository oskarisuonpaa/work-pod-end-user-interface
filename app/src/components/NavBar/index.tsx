import { Link, useLocation } from "react-router";
import { useAuth } from "../../auth/useAuth";
import { useTranslation } from "react-i18next";
import "./NavBar.css";

const Navbar = () => {
  const { isAuthenticated, onLogout } = useAuth();
  const location = useLocation();
  const loggedIn = isAuthenticated();

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('userLanguage', lng);
  }

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link to={to} className={isActive(to) ? "active-link" : ""}>
      {label}
    </Link>
  );

  return (
    <>
    <nav className="navbar">
      {loggedIn && (
        <>
          <NavLink to="/dashboard" label={t("navbar-dashboard")} />
          <NavLink to="/workpods" label={t("navbar-workpods")} />
          <NavLink to="/reservations" label={t("navbar-reservations")} />
          <NavLink to="/search" label={t("navbar-search")} />
        </>
      )}
      <NavLink to="/info" label="Info" />

      {!loggedIn && <NavLink to="/login" label={t("navbar-login")} />}

      {loggedIn && (
        <Link
          to="/login"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
        >
          {t("navbar-logout")}
        </Link>
      )}
    <span className="language-selector">
      <button
        className={i18n.language === "en" ? "lng-active" : "lng"}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
      <button
        className={i18n.language === "fi" ? "lng-active" : "lng"}
        onClick={() => changeLanguage("fi")}
      >
        FI
      </button>
      </span>
    </nav>
    </>
  );
};

export default Navbar;
