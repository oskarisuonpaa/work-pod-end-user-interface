type Props = {
  slot: { start: string; end: string };
  onReserve: (slot: { start: string; end: string }) => void;
};

const ReserveButton = ({ slot, onReserve }: Props) => (
  <div className="button-container">
    <button className="reserve-button" onClick={() => onReserve(slot)}>
      Reserve Slot
    </button>
  </div>
);

export default ReserveButton;
