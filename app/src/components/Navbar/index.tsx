import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { useAuth } from "@auth/useAuth";
import { useEffect, useState } from "react";
import "./Navbar.css";

/**
 * Navbar component renders the navigation bar with links to different pages.
 * It includes language selection and login/logout functionality.
 * @module Navbar
 * @description This component is used to navigate between different sections of the application.
 */
const Navbar = () => {
  const { isAuthenticated, onLogout } = useAuth();
  const location = useLocation();
  const loggedIn = isAuthenticated();

  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<string>(i18n.language);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
    localStorage.setItem("userLanguage", lng);
  };
  useEffect(() => {
    document.title = t("title");
    document.documentElement.lang = lang; // Update the document language attribute for accessibility
  }, [lang, t]);

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link to={to} className={isActive(to) ? "active-link" : ""}>
      {label}
    </Link>
  );

  return (
    <>
      <nav
        className="navbar"
        role="navigation"
        aria-label={t("navbar-navigation")}
      >
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
            aria-current={i18n.language === "en" ? "true" : undefined}
            aria-label={t("language-english")}
          >
            EN
          </button>
          <button
            className={i18n.language === "fi" ? "lng-active" : "lng"}
            onClick={() => changeLanguage("fi")}
            aria-current={i18n.language === "fi" ? "true" : undefined}
            aria-label={t("language-finnish")}
          >
            FI
          </button>
        </span>
      </nav>
    </>
  );
};

export default Navbar;
