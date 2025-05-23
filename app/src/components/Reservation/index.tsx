import { useNavigate, useParams } from "react-router";
import "./Reservation.css";
import { parseDate, parseTime } from "../../utils/DateTimeParsing";
import { useEffect, useMemo, useState } from "react";
import {
  deleteReservation,
  getUserReservations,
} from "../../utils/BackendCommunication";

type ReservationType = {
  id: string;
  start: string;
  end: string;
  calendarId: string;
};

const Reservation = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getUserReservations();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setError("Failed to load reservations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const reservation = useMemo(() => {
    return reservations.find((res) => res.id === reservationId);
  }, [reservations, reservationId]);

  const handleCancel = async (calendarId: string, reservationId: string) => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await deleteReservation(calendarId, reservationId);
        alert(`Reservation ${reservationId} cancelled.`);
        navigate("/reservations");
      } catch (error) {
        console.error("Error cancelling reservation:", error);
        alert("Failed to cancel reservation. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="page-title">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="page-title">
          <h1>Error</h1>
        </div>
        <p>{error}</p>
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
        <h2>Work Pod: {reservation.calendarId}</h2>
        <p className="date-info">Date: {parseDate(reservation.start)}</p>
        <p className="time-info">
          Time: {parseTime(reservation.start)} - {parseTime(reservation.end)}
        </p>
      </div>
      <button
        className="cancel-button"
        onClick={() => handleCancel(reservation.calendarId, reservation.id)}
      >
        Cancel Reservation
      </button>
    </div>
  );
};

export default Reservation;
