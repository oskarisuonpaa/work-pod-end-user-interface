import "./LinkButton.css";
import { FaArrowRight } from "react-icons/fa6";

type LinkButtonProps = {
  label: string;
  href: string;
};

const LinkButton = ({ label, href }: LinkButtonProps) => {
  return (
    <a className="link-button" href={href}>
      <span className="link-content">
        <span className="link-label">{label}</span>
        <FaArrowRight />
      </span>
    </a>
  );
};

export default LinkButton;
