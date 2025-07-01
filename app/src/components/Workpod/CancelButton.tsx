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
 * @param {Props} props - The component props containing slots, cancel function, and optional button reference.
 * @returns {JSX.Element} The rendered cancel button.
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
