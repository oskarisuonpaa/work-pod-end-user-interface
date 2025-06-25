import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Navigate } from "react-router";
import "./Reservation.css";
import { reservationApi } from "api/reservations";
import { useTranslation } from "react-i18next";
import PageWrapper from "@components/PageWrapper";
import ActionButton from "@components/ActionButton";
import type { ReservationInfo } from "@types";

const ReservationInfoPage = () => {
  const { calendarId, reservationId } = useParams<{
    calendarId: string;
    reservationId: string;
  }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [reservation, setReservation] = useState<ReservationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const didFetch = useRef(false);

  useEffect(() => {
    if (!calendarId || !reservationId || didFetch.current) return;
    didFetch.current = true;

    (async () => {
      setIsLoading(true);
      try {
        const data = await reservationApi.getSingleReservation({
          calendarId,
          reservationId,
        });
        setReservation(data);
      } catch (err) {
        console.error("Error fetching reservation:", err);
        setError(t("reservation-failed-load"));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [calendarId, reservationId, t]);

  if (!calendarId || !reservationId) {
    return <Navigate to="/reservations" replace />;
  }

  const handleCancel = async () => {
    if (!confirm(t("reserve-confirm-cancel"))) return;
    try {
      await reservationApi.deleteReservation({ calendarId, reservationId });
      alert(t("reservation-canceled", { reservationId }));
      navigate("/reservations");
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      alert(t("error-failed-cancel"));
    }
  };

  if (isLoading) {
    return <PageWrapper pageTitle={t("loading") + "..."} />;
  }
  if (error || !reservation) {
    return (
      <PageWrapper pageTitle={t("reservation-not-found")}>
        <p role="status">{error || t("reservation-not-yours")}</p>
      </PageWrapper>
    );
  }

  const formatTime = (s: string) => {
    if (/^\d{2}:\d{2}$/.test(s)) return s;
    let iso = s;
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(s)) iso = s + "Z";
    const d = new Date(iso);
    return isNaN(d.getTime())
      ? s
      : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (s: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleDateString();
  };

  return (
    <PageWrapper pageTitle={t("reservation-info")}>
      <div className="reservation-info">
        <h2>
          {t("workpod")}: {reservation.room}
        </h2>
        <p className="date-info">
          {t("date")}: {formatDate(reservation.date)}
        </p>
        <p className="time-info">
          {t("time")}: {formatTime(reservation.start)} -{" "}
          {formatTime(reservation.end)}
        </p>
      </div>
      <ActionButton
        className="cancel"
        onClick={handleCancel}
        label={t("cancel-button")}
      />
    </PageWrapper>
  );
};

export default ReservationInfoPage;
