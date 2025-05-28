import { useTranslation } from "react-i18next";
type CancelButtonProps = {
  slot: { start: string; end: string };
  onCancel: (slot: { start: string; end: string }) => void;
};

const CancelButton = ({ slot, onCancel }: CancelButtonProps) => {
  const {t} = useTranslation();
  return (
  <div className="button-container">
    <button className="cancel-button" onClick={() => onCancel(slot)}>
      {t("cancel-button")}
    </button>
  </div>
)};

export default CancelButton;
