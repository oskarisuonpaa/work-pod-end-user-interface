import ActionButton from "@components/ActionButton";
import { parseTime } from "@utils/dateTime";

type Props = {
  slot: { start: string; end: string };
  onReserve: (slot: { start: string; end: string }) => void;
};

const ReserveButton = ({ slot, onReserve }: Props) => (
  <div className="button-container">
    <ActionButton
      label={`Reserve slot from ${parseTime(slot.start)} to ${parseTime(
        slot.end
      )}`}
      onClick={() => onReserve(slot)}
    />
  </div>
);

export default ReserveButton;
