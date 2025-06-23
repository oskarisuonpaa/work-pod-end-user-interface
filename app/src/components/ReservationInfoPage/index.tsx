import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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

  useEffect(() => {
    if (!calendarId || !reservationId) {
      navigate("/reservations");
      return;
    }
    const fetchReservation = async () => {
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
    };

    fetchReservation();
  }, [calendarId, reservation, navigate, t, reservationId]);

  const handleCancel = async () => {
    const confirmed = confirm(t("reserve-confirm-cancel"));
    if (!confirmed) return;

    try {
      if (!calendarId || !reservationId) {
        throw new Error(t("error-missing-ids"));
      }
      await reservationApi.deleteReservation({ calendarId, reservationId });
      alert(t("reservation-canceled", { reservationId: reservationId }));
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
    return <PageWrapper pageTitle={t("loading") + "..."} />;
  }
  if (error || !reservation) {
    return (
      <PageWrapper pageTitle={t("reservation-not-found")}>
        <p role="status">{error || t("reservation-not-yours")}</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper pageTitle={t("reservation-info")}>
      <div className="reservation-info">
        <h2>
          {t("workpod")}: {reservation.room}
        </h2>
        <p className="date-info">
          {t("date")}: {reservation.date}
        </p>
        <p className="time-info">
          {t("time")}: {reservation.start} - {reservation.end}
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
