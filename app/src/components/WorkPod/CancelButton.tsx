type CancelButtonProps = {
  slot: { start: string; end: string };
  onCancel: (slot: { start: string; end: string }) => void;
};

const CancelButton = ({ slot, onCancel }: CancelButtonProps) => (
  <div className="button-container">
    <button className="cancel-button" onClick={() => onCancel(slot)}>
      Cancel Reservation
    </button>
  </div>
);

export default CancelButton;
