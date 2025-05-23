import { useNavigate, useParams } from "react-router";
import "./Reservation.css";
import { parseDate, parseTime } from "../../utils/DateTimeParsing";
import { useEffect, useState } from "react";
import { getUserReservations } from "../../utils/BackendCommunication";

type ReservationType = {
  id: string;
  start: string;
  end: string;
  calendarId: string;
};

const Reservation = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await getUserReservations();
        setReservations(reservations);
        if (firstLoad) {
          setFirstLoad(false);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  const reservation = reservations.find((res) => res.id === reservationId);

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      // await deleteReservation(reservationId)
      alert(`Reservation ${reservationId} cancelled.`);
      navigate("/reservations");
    }
  };

  if (firstLoad) {
    return (
      <div className="page-content">
        <div className="page-title">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="page-content">
        <div className="page-title">
          <h1>Reservation Not Found</h1>
        </div>
        <p>
          The reservation you are looking for does not exist or doesn't belong
          to you.
        </p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>Reservation Info</h1>
      </div>
      <div className="reservation-info">
        <h2>Work Pod: C230-1</h2>
        <p className="date-info">Date: {parseDate(reservation.start)}</p>
        <p className="time-info">
          Time: {parseTime(reservation.start)} - {parseTime(reservation.end)}
        </p>
      </div>
      <button className="cancel-button" onClick={handleCancel}>
        Cancel Reservation
      </button>
    </div>
  );
};

export default Reservation;
