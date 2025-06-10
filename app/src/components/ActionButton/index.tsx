import { Link } from "react-router";
import { forwardRef } from "react";
import "./ActionButton.css";

type CommonProps = {
  label: string;
  className?: string;
};

type LinkVariant = {
  to: string;
  onClick?: never;
  type?: never;
};

type ButtonVariant = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  to?: never;
};

type ActionButtonProps = CommonProps & (LinkVariant | ButtonVariant);

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ label, className = "", ...rest }, ref) => {
    const baseClass = `button ${className}`.trim();

  if ("to" in rest && rest.to) {
    return (
      <Link to={rest.to} className={baseClass}>
        {label}
      </Link>
    );
  }

  return (
    <button className={baseClass} {...rest} ref={ref}>
      {label}
    </button>
  );
});

export default ActionButton;
