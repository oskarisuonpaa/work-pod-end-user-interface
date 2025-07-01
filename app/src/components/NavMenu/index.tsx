import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@auth/useAuth";
import "./NavMenu.css";

/**
 * NavMenu component renders a mobile navigation menu with links to various sections of the application.
 * It includes language selection and login/logout functionality.
 * @returns {JSX.Element} The rendered navigation menu.
 * @description This component provides a responsive navigation menu for mobile devices.
 * It also includes options for changing the language and logging in or out.
 * The menu can be opened and closed with a button, and it highlights the active link based on the current URL path.
 */
const NavMenu = () => {
  const location = useLocation();
  const { isAuthenticated, onLogout } = useAuth();
  const loggedIn = isAuthenticated();

  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<string>(i18n.language);
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
    localStorage.setItem("userLanguage", lng);
  };

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, label }: { to: string; label: string }) => (
    <li className={`mobile-nav-item ${isActive(to) ? "active" : ""}`}>
      <Link to={to} onClick={() => setOpen(false)}>
        <span>{label}</span>
        <i className="icon-chevron-right" />
      </Link>
    </li>
  );

  return (
    <>
      <div className="mobile-nav-trigger">
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <i className="icon-menu" />
        </button>
      </div>

      {open && (
        <nav className="mobile-nav-overlay" aria-label={t("navbar-navigation")}>
          <button
            className="mobile-nav-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            <span className="close-bar top" />
            <span className="close-bar bottom" />
          </button>

          <ul className="mobile-nav-list">
            {loggedIn && (
              <>
                <NavItem to="/dashboard" label={t("navbar-dashboard")} />
                <NavItem to="/workpods" label={t("navbar-workpods")} />
                <NavItem to="/reservations" label={t("navbar-reservations")} />
                <NavItem to="/search" label={t("navbar-search")} />
              </>
            )}
            <NavItem to="/info" label="Info" />

            {!loggedIn && <NavItem to="/login" label={t("navbar-login")} />}

            {loggedIn && (
              <li className="mobile-nav-item">
                <Link
                  to="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    onLogout();
                    setOpen(false);
                  }}
                >
                  <span>{t("navbar-logout")}</span>
                  <i className="icon-chevron-right" />
                </Link>
              </li>
            )}
          </ul>

          <div className="mobile-nav-footer">
            <button
              className={`lang ${lang === "fi" ? "active" : ""}`}
              onClick={() => changeLanguage("fi")}
              aria-current={i18n.language === "fi" ? "true" : undefined}
              aria-label={t("language-finnish")}
            >
              FI
            </button>
            <button
              className={`lang ${lang === "en" ? "active" : ""}`}
              onClick={() => changeLanguage("en")}
              aria-current={i18n.language === "en" ? "true" : undefined}
              aria-label={t("language-english")}
            >
              EN
            </button>
          </div>
        </nav>
      )}
    </>
  );
};

export default NavMenu;
