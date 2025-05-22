import { Link } from "react-router";
import { useAuth } from "../AuthProvider";
import "./NavBar.css";

const NavBar = () => {
  const { token } = useAuth();
  return (
    <nav className="navbar">
      {token && 
      <><Link to="/dashboard">Dashboard </Link>      
      <Link to="/workpods">Workpods </Link>
      <Link to="/search">Search </Link></>}
      {!token && 
      <Link to="/login">Login </Link>}
      <Link to="/info">Info</Link>
    
    </nav>
  );
};

export default NavBar;
