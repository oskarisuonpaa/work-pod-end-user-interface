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
  const [reservation, setReservation] = useState<ReservationType>();
  const [firstLoad, setFirstLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (!calendarId || !reservationId) {
          setReservation(undefined);
          setFirstLoad(false);
          return;
        }
        const data = await getSingleReservation(calendarId, reservationId);
        setReservation(data);
        if (firstLoad) {
          setFirstLoad(false);
        }
      } catch (error) {
        console.error("Error fetching reservation:", error);
      }
    };

    fetchReservations();
  }, []);

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      if (calendarId && reservationId) {
        await deleteReservation(calendarId, reservationId);
        alert(`Reservation ${reservationId} cancelled.`);
        navigate("/reservations");
      } else {
        alert("Invalid reservation or calendar ID.");
      }
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
