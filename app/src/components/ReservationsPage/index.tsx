import { useEffect, useState } from "react";
import { reservationApi } from "api/reservations";
import { useTranslation } from "react-i18next";
import PageWrapper from "@components/PageWrapper";
import ReservationLink from "@components/ReservationLink";
import type { UserReservation } from "@types";
import "./Reservations.css";

/**
 * ReservationsPage component displays a list of user reservations.
 * It fetches the reservations from the API and renders them as links.
 * If there are no reservations, it shows a message indicating that.
 * @component
 * @returns {JSX.Element} The rendered reservations page with a list of user reservations.
 * @description This component fetches the user's reservations from the API,
 * handles loading state, and displays the reservations as links. If there are no reservations,
 * it shows a message indicating that there are no reservations.
 */
const ReservationsPage = () => {
  const [reservations, setReservations] = useState<UserReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    reservationApi
      .getUserReservations()
      .then((list) => setReservations(list))
      .catch((err) => console.error("Error fetching reservations:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <PageWrapper pageTitle={t("loading") + "..."} />;
  }
  if (reservations.length === 0) {
    return <PageWrapper pageTitle={t("reservations-no-reservations")} />;
  }

  return (
    <PageWrapper pageTitle={t("reservations-your")}>
      <div className="reservations-container">
        <ul>
          {reservations.map((res) => (
            <li key={res.id}>
              <ReservationLink reservation={res} />
            </li>
          ))}
        </ul>
      </div>
    </PageWrapper>
  );
};

export default ReservationsPage;
