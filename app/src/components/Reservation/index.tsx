import { useNavigate, useParams } from "react-router";
import "./Reservation.css";

const Reservation = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      alert(`Reservation ${reservationId} cancelled.`);
      navigate("/reservations");
    }
  };

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>Reservation Info</h1>
      </div>
      <div className="reservation-info">
        <h2>Work Pod: C230-1</h2>
        <p className="date-info">Date: 15.5.2025</p>
        <p className="time-info">Time: 10:00 - 11:00</p>
      </div>
      <button className="cancel-button" onClick={handleCancel}>
        Cancel Reservation
      </button>
    </div>
  );
};

export default Reservation;
