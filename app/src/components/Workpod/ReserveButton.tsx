import { useTranslation } from "react-i18next";
import ActionButton from "@components/ActionButton";
import { parseTime } from "@utils/dateTime";
import type { ReservationSlot } from "@types";
import type { Ref } from "react";

type Props = {
  slot: ReservationSlot;
  onReserve: (slot: ReservationSlot) => void;
  buttonRef?: Ref<HTMLButtonElement>;
};

const ReserveButton = ({ slot, onReserve, buttonRef }: Props) => {
  const { t } = useTranslation();
  const start = parseTime(slot.start);
  const end = parseTime(slot.end);
  return (
    <div className="button-container">
      <ActionButton
        label={t("reserve-to-from", { start: start, end: end })}
        onClick={() => onReserve(slot)}
        ref={buttonRef}
      />
    </div>
  );
};

export default ReserveButton;
