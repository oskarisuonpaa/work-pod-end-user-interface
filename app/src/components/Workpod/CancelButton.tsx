import { useTranslation } from "react-i18next";
import ActionButton from "@components/ActionButton";

type CancelButtonProps = {
  slot: { start: string; end: string };
  onCancel: (slot: { start: string; end: string }) => void;
};

const CancelButton = ({ slot, onCancel }: CancelButtonProps) => {
  const {t} = useTranslation();
  return (
  <div className="button-container">
    <ActionButton
      label={t("cancel-button")}
      onClick={() => onCancel(slot)}
      className="cancel"
    />
  </div>
)};

export default CancelButton;
