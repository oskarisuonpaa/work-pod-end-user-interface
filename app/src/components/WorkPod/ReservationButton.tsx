type Props = {
  slot: { start: string; end: string };
  onReserve: (slot: { start: string; end: string }) => void;
};

const ReservationButton = ({ slot, onReserve }: Props) => (
  <div className="button-container">
    <button className="reservation-button" onClick={() => onReserve(slot)}>
      Reserve Slot
    </button>
  </div>
);

export default ReservationButton;
