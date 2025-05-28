import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./Reservation.css";
import {
  deleteReservation,
  getSingleReservation,
} from "@utils/backendCommunication";
import PageWrapper from "@components/PageWrapper";
import ActionButton from "@components/ActionButton";

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
    if (!calendarId || !reservationId) {
      navigate("/reservations");
      return;
    }
    const fetchReservation = async () => {
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
  }, [calendarId, reservationId, navigate]);

  const handleCancel = async () => {
    const confirmed = confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirmed) return;

    try {
      if (!calendarId || !reservationId) {
        throw new Error("Missing calendarId or reservationId.");
      }
      await deleteReservation(calendarId, reservationId);
      alert(`Reservation ${reservationId} cancelled.`);
      navigate("/reservations");
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      alert("Failed to cancel reservation. Please try again.");
    }
  };

  if (!calendarId || !reservationId) {
    return null;
  }

  if (isLoading) {
    return <PageWrapper pageTitle="Loading.." />;
  }
  if (error || !reservation) {
    return (
      <PageWrapper pageTitle="Reservation Not Found">
        <p>
          {error ||
            "The reservation you are looking for does not exist or doesn't belong to you."}
        </p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper pageTitle="Reservation Info">
      <div className="reservation-info">
        <h2>Work Pod: {reservation.room}</h2>
        <p className="date-info">Date: {reservation.date}</p>
        <p className="time-info">
          Time: {reservation.start} - {reservation.end}
        </p>
      </div>
      <ActionButton
        className="cancel"
        onClick={handleCancel}
        label="Cancel Reservation"
      />
    </PageWrapper>
  );
};

export default Reservation;
