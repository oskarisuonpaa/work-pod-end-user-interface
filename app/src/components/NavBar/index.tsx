import { Link } from "react-router";
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard </Link>
      <Link to="/login">Login </Link>
      <Link to="/workpods">Workpods </Link>
      <Link to="/search">Search </Link>
      <Link to="/searchresults">Search Results </Link>
      <Link to="/info">Info</Link>
    </nav>
  );
};

export default NavBar;
