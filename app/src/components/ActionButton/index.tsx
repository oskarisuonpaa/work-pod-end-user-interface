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

/**
 * ActionButton component renders a button or a link with a label.
 * It can be used for navigation or actions within the application.
 * @module ActionButton
 * @props {ActionButtonProps}
 * @param {string} label - The text to display on the button or link.
 * @param {string} [className] - Additional CSS classes to apply to the button or link.
 * @param {string} [to] - The route to navigate to when the button is clicked (if using as a link).
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [rest] - Additional attributes for the button element (if using as a button).
 * @description This component is used to create buttons that can either navigate to a different route or perform an action.
 */
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
