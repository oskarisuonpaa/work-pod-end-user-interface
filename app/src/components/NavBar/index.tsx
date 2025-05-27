import { Link, useLocation } from "react-router";
import { useAuth } from "../../auth/useAuth";
import "./NavBar.css";

const Navbar = () => {
  const { isAuthenticated, onLogout } = useAuth();
  const location = useLocation();
  const loggedIn = isAuthenticated();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link to={to} className={isActive(to) ? "active-link" : ""}>
      {label}
    </Link>
  );

  return (
    <nav className="navbar">
      {loggedIn && (
        <>
          <NavLink to="/dashboard" label="Dashboard" />
          <NavLink to="/workpods" label="Workpods" />
          <NavLink to="/reservations" label="Reservations" />
          <NavLink to="/search" label="Search" />
        </>
      )}
      <NavLink to="/info" label="Info" />

      {!loggedIn && <NavLink to="/login" label="Login" />}

      {loggedIn && (
        <Link
          to="/login"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
        >
          Logout
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
