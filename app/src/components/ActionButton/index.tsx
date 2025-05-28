import { Link } from "react-router";
import "./ActionButton.css";

type CommonProps = {
  label: string;
  className?: string;
};

type LinkVariant = {
  to: string;
  onClick?: never;
};

type ButtonVariant = {
  to?: never;
  onClick: () => void;
};

type ActionButtonProps = CommonProps & (LinkVariant | ButtonVariant);

const ActionButton = ({
  label,
  className = "",
  ...rest
}: ActionButtonProps) => {
  const baseClass = `button-style--border ${className}`.trim();

  if ("to" in rest && rest.to) {
    return (
      <Link to={rest.to} className={baseClass}>
        {label}
      </Link>
    );
  }

  return (
    <button onClick={rest.onClick} className={baseClass}>
      {label}
    </button>
  );
};

export default ActionButton;
