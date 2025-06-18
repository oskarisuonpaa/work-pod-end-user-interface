import { useTranslation } from "react-i18next";
import ActionButton from "@components/ActionButton";
import { parseTime } from "@utils/dateTime";
import type { ReservationSlot } from "@types";
import type { Ref } from "react";

type CancelButtonProps = {
  slot: ReservationSlot;
  onCancel: (slot: ReservationSlot) => void;
  buttonRef?: Ref<HTMLButtonElement>;
};

const CancelButton = ({ slot, onCancel, buttonRef }: CancelButtonProps) => {
  const { t } = useTranslation();
  const start = parseTime(slot.start);
  const end = parseTime(slot.end);
  return (
    <div className="button-container">
      <ActionButton
        label={t("cancel-button-to-from", { start: start, end: end })}
        onClick={() => onCancel(slot)}
        className="cancel"
        ref={buttonRef}
      />
    </div>
  );
};

export default CancelButton;
