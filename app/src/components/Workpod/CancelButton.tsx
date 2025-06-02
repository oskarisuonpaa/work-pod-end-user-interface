import { useTranslation } from "react-i18next";
import ActionButton from "@components/ActionButton";
import type { ReservationSlot } from "@types";

type CancelButtonProps = {
  slot: ReservationSlot;
  onCancel: (slot: ReservationSlot) => void;
};

const CancelButton = ({ slot, onCancel }: CancelButtonProps) => {
  const { t } = useTranslation();
  return (
    <div className="button-container">
      <ActionButton
        label={t("cancel-button")}
        onClick={() => onCancel(slot)}
        className="cancel"
      />
    </div>
  );
};

export default CancelButton;
