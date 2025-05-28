import ActionButton from "@components/ActionButton";

type CancelButtonProps = {
  slot: { start: string; end: string };
  onCancel: (slot: { start: string; end: string }) => void;
};

const CancelButton = ({ slot, onCancel }: CancelButtonProps) => (
  <div className="button-container">
    <ActionButton
      label="Cancel Reservation"
      onClick={() => onCancel(slot)}
      className="cancel"
    />
  </div>
);

export default CancelButton;
