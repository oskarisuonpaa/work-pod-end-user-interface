import { useNavigate, useParams } from "react-router";
import "./Reservation.css";
import { useEffect, useState } from "react";
import {
  deleteReservation,
  getSingleReservation,
} from "../../utils/BackendCommunication";

type ReservationType = {
  id: string;
  start: string;
  end: string;
  calendarId: string;
  date: string;
  room: string;
};

const Reservation = () => {
  const { calendarId, reservationId } = useParams<{
    calendarId: string;
    reservationId: string;
  }>();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState<ReservationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservation = async () => {
      if (!calendarId || !reservationId) {
        setError("Missing calendar or reservation ID.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getSingleReservation(calendarId, reservationId);
        setReservation(data);
      } catch (err) {
        console.error("Error fetching reservation:", err);
        setError(
          "Failed to load reservation. It may not exist or is not accessible."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [calendarId, reservationId]);

  const handleCancel = async () => {
    if (!calendarId || !reservationId) {
      alert("Invalid reservation or calendar ID.");
      return;
    }

    const confirmed = confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirmed) return;

    try {
      await deleteReservation(calendarId, reservationId);
      alert(`Reservation ${reservationId} cancelled.`);
      navigate("/reservations");
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      alert("Failed to cancel reservation. Please try again.");
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

  if (error || !reservation) {
    return (
      <div className="page-content">
        <div className="page-title">
          <h1>Reservation Not Found</h1>
        </div>
        <p>
          {error ||
            "The reservation you are looking for does not exist or doesn't belong to you."}
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
        <h2>Work Pod: {reservation.room}</h2>
        <p className="date-info">Date: {reservation.date}</p>
        <p className="time-info">
          Time: {reservation.start} - {reservation.end}
        </p>
      </div>
      <button className="cancel-button" onClick={handleCancel}>
        Cancel Reservation
      </button>
    </div>
  );
};

export default Reservation;
