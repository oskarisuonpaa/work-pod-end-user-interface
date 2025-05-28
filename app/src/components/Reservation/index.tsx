import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./Reservation.css";
import {
  deleteReservation,
  getSingleReservation,
} from "@utils/backendCommunication";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
          t("reservation-failed-load")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [calendarId, reservationId, navigate]);

  const handleCancel = async () => {
    const confirmed = confirm(
      t("reserve-confirm-cancel")
    );
    if (!confirmed) return;

    try {
      if (!calendarId || !reservationId) {
        throw new Error(t("error-missing-ids"));
      }
      await deleteReservation(calendarId, reservationId);
      alert(t("reservation-canceled", {reservationId:reservationId}));
      navigate("/reservations");
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      alert(t("error-failed-cancel"));
    }
  };

  if (!calendarId || !reservationId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="page-title">
          <h1>{t("loading")}...</h1>
        </div>
      </div>
    );
  }
  if (error || !reservation) {
    return (
      <div className="page-content">
        <div className="page-title">
          <h1>{t("reservation-not-found")}</h1>
        </div>
        <p>
          {error ||
            t("reservation-not-yours")}
        </p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>{t("reservation-info")}</h1>
      </div>
      <div className="reservation-info">
        <h2>{t("workpod")}: {reservation.room}</h2>
        <p className="date-info">{t("date")}: {reservation.date}</p>
        <p className="time-info">
          {t("time")}: {reservation.start} - {reservation.end}
        </p>
      </div>
      <button className="cancel-button" onClick={handleCancel}>
        {t("cancel-button")}
      </button>
    </div>
  );
};

export default Reservation;
