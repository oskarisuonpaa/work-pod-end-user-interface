import { useEffect, useState } from "react";
import "./Reservations.css";
import { reservationApi } from "api/reservations";
import PageWrapper from "../PageWrapper/index";
import ReservationLink from "../ReservationLink";
import { useTranslation } from "react-i18next";
import type { ReservationType } from "@types";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await reservationApi.getUserReservations();
        setReservations(reservations);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  if (isLoading) {
    return <PageWrapper pageTitle={t("loading") + "..."}></PageWrapper>;
  }

  if (reservations.length === 0) {
    return (
      <PageWrapper pageTitle={t("reservations-no-reservations")}></PageWrapper>
    );
  }

  return (
    <PageWrapper pageTitle={t("reservations-your")}>
      <div className="reservations-container">
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <ReservationLink
                id={reservation.id}
                podName={reservation.calendarId}
                date={reservation.start}
                startTime={reservation.start}
                endTime={reservation.end}
              />
            </li>
          ))}
        </ul>
      </div>
    </PageWrapper>
  );
};

export default ReservationsPage;
