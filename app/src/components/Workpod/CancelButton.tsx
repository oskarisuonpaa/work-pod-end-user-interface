import { useTranslation } from "react-i18next";
import ActionButton from "@components/ActionButton";
import { parseTime } from "@utils/dateTime";
import type { CalendarEvent } from "@types";
import type { Ref } from "react";

type Props = {
  slots: CalendarEvent[];
  onCancel: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
};

/**
 * CancelButton component renders a button to cancel selected time slots.
 * It displays a label based on the number of slots selected.
 * @component
 * @param {Props} props - The component props containing slots, cancel function, and optional button reference.
 * @returns {JSX.Element} The rendered cancel button.
 * @description This component is used to cancel reservations for selected time slots.
 * If only one slot is selected, it shows the time range of that slot.
 * If multiple slots are selected, it shows the count of slots being canceled.
 */
const CancelButton = ({ slots, onCancel, buttonRef }: Props) => {
  const { t } = useTranslation();

  const label =
    slots.length === 1
      ? (() => {
          const { start, end } = slots[0];
          return t("cancel-button-to-from", {
            start: parseTime(start),
            end: parseTime(end),
          });
        })()
      : t("cancel-multiple-slots", { count: slots.length });

  return (
    <div className="button-container">
      <ActionButton
        label={label}
        onClick={onCancel}
        className="cancel"
        ref={buttonRef}
      />
    </div>
  );
};

export default CancelButton;
