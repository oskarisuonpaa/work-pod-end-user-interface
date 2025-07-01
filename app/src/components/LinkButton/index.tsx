import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router";
import "./LinkButton.css";

type LinkButtonProps = {
  label: string;
  to: string;
};

/**
 * LinkButton component renders a styled link with an arrow icon.
 * It can be used for navigation within the application.
 * @module LinkButton
 * @description This component is used to create links that navigate to different routes with a consistent style.
 */
const LinkButton = ({ label, to }: LinkButtonProps) => {
  return (
    <Link className="link-button" to={to}>
      <span className="link-content">
        <span className="link-label">{label}</span>
        <FaArrowRight />
      </span>
    </Link>
  );
};

export default LinkButton;
