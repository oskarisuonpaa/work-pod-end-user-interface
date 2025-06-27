// ReserveButton.tsx
import { useTranslation } from "react-i18next";
import ActionButton from "@components/ActionButton";
import { parseTime } from "@utils/dateTime";
import type { CalendarEvent } from "@types";
import type { Ref } from "react";

type Props = {
  slots: CalendarEvent[];
  onReserve: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
};

const ReserveButton = ({ slots, onReserve, buttonRef }: Props) => {
  const { t } = useTranslation();

  const label =
    slots.length === 1
      ? (() => {
          const { start, end } = slots[0];
          return t("reserve-to-from", {
            start: parseTime(start),
            end: parseTime(end),
          });
        })()
      : t("reserve-multiple-slots", { count: slots.length });

  return (
    <div className="button-container">
      <ActionButton label={label} onClick={onReserve} ref={buttonRef} />
    </div>
  );
};

export default ReserveButton;
