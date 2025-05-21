import { useParams } from "react-router";
import "./Reservation.css";

const Reservation = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
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
    </div>
  );
};

export default Reservation;
