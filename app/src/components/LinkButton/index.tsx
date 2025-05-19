import { Link } from "react-router";
import "./LinkButton.css";
import { FaArrowRight } from "react-icons/fa6";

type LinkButtonProps = {
  label: string;
  to: string;
};

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
