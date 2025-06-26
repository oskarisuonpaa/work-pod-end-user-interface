import { useLocation, Navigate, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import PageWrapper from "@components/PageWrapper";
import ActionButton from "@components/ActionButton";
import { reservationApi } from "api/reservations";
import type { ReservationInfo } from "@types";
import "./Reservation.css";
import { parseDate, parseTime } from "@utils/dateTime";

type LocState = {
  reservation?: ReservationInfo;
};

const ReservationInfoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const reservation = (location.state as LocState)?.reservation;
  if (!reservation) {
    return <Navigate to="/reservations" replace />;
  }

  const { id, room: calendarId, start, end } = reservation;

  const handleCancel = () => {
    if (!confirm(t("reserve-confirm-cancel"))) return;

    reservationApi.deleteReservation({
      calendarId,
      reservationId: id,
    });
    alert(t("reservation-canceled", { reservationId: id }));
    navigate("/reservations");
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
