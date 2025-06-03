import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { useAuth } from "@auth/useAuth";
import { useEffect, useState } from 'react';
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, onLogout } = useAuth();
  const location = useLocation();
  const loggedIn = isAuthenticated();

  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<string>(i18n.language);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
    localStorage.setItem('userLanguage', lng);
  }
  useEffect(() => { document.title = t('title') }, [lang]);

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
        <div className="language-switcher">
          <ul>
            <li><a href="#"
              className={"lng" + (i18n.language === "en" ? " lng-active" : "")}
              onClick={() => changeLanguage("en")}
             >
              EN</a>
            </li>
            <li><a href="#"
              className={"lng" + (i18n.language === "fi" ? " lng-active" : "")}
              onClick={() => changeLanguage("fi")}
            >
              FI</a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
