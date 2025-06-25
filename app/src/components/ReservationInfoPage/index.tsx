import { useLocation, Navigate, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import PageWrapper from "@components/PageWrapper";
import ActionButton from "@components/ActionButton";
import { parseDate, parseTime } from "@utils/dateTime";
import type { UserReservation } from "@types";
import "./Reservation.css";
import { reservationApi } from "api/reservations";

type LocState = {
  reservation?: UserReservation;
};

const ReservationInfoPage = () => {
  const location = useLocation() as { state: LocState };
  const navigate = useNavigate();
  const { t } = useTranslation();

  const reservation = location.state?.reservation;

  if (!reservation) {
    return <Navigate to="/reservations" replace />;
  }

  const { id, calendarId, start, end } = reservation;

  const handleCancel = async () => {
    if (!confirm(t("reserve-confirm-cancel"))) return;

    try {
      await reservationApi.deleteReservation({
        calendarId,
        reservationId: id,
      });
      alert(t("reservation-canceled", { reservationId: id }));
      navigate("/reservations");
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      alert(t("error-failed-cancel"));
    }
  };

  return (
    <PageWrapper pageTitle={t("reservation-info")}>
      <div className="reservation-info">
        <h2>
          {t("workpod")}: {calendarId}
        </h2>
        <p className="date-info">
          {t("date")}: {parseDate(start)}
        </p>
        <p className="time-info">
          {t("time")}: {parseTime(start)} - {parseTime(end)}
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
