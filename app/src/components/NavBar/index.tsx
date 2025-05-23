import { Link } from "react-router";
import { useAuth } from "../AuthProvider";
import "./NavBar.css";

const NavBar = () => {
  const { token, onLogout } = useAuth();
  return (
    <nav className="navbar">
      {token && (
        <>
          <Link to="/dashboard">Dashboard </Link>
          <Link to="/workpods">Workpods </Link>
          <Link to="/reservations">Reservations </Link>
          <Link to="/search">Search </Link>
        </>
      )}

      <Link to="/info">Info</Link>
      {!token && <Link to="/login">Login </Link>}
      {token && (
        <Link onClick={onLogout} to="/login">
          Logout
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
