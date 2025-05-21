import ReservationLink from "../ReservationLink";
import "./Reservations.css";

const Reservations = () => {
  return (
    <div className="page-content">
      <div className="page-title">
        <h1>Your Reservations</h1>
      </div>
      <div className="reservations-container">
        <ul>
          <li>
            <ReservationLink
              id="C230-1"
              podName="C230-1"
              date="20.5.2025"
              startTime="9:00"
              endTime="10:00"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Reservations;
