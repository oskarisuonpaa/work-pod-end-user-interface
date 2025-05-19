import "./LinkButton.css";

type LinkButtonProps = {
  label: string;
  href: string;
};

const LinkButton = ({ label, href }: LinkButtonProps) => {
  return (
    <a className="link-button" href={href}>
      {label}
    </a>
  );
};

export default LinkButton;
