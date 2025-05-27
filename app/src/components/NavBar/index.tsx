// Navbar
import { Link } from "react-router";
import { useAuth } from "../AuthProvider";
import { useTranslation } from "react-i18next";
import "./NavBar.css";

const NavBar = () => {
  const { token, onLogout } = useAuth();
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  }
  return (
    <>
    <nav className="navbar">
      {token && (
        <>
          <Link to="/dashboard">{t("navbar-dashboard") }</Link>
          <Link to="/workpods">{t("navbar-workpods")} </Link>
          <Link to="/reservations">{t("navbar-reservations")} </Link>
          <Link to="/search">{t("navbar-search")} </Link>
        </>
      )}

      <Link to="/info">Info</Link>
      {!token && <Link to="/login">{t("navbar-login")} </Link>}
      {token && (
        <Link onClick={onLogout} to="/login">
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

export default NavBar;
