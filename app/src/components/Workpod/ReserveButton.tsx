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

/**
 * ReserveButton component renders a button to reserve selected time slots.
 * It displays a label based on the number of slots selected.
 * @component
 * @param {Props} props - The component props containing slots, reserve function, and optional button reference.
 * @returns {JSX.Element} The rendered reserve button.
 * @description This component is used to reserve time slots for a work pod.
 * If only one slot is selected, it shows the time range of that slot.
 * If multiple slots are selected, it shows the count of slots being reserved.
 */
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
