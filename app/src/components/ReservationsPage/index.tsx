import { useEffect, useState } from "react";
import { reservationApi } from "api/reservations";
import { useTranslation } from "react-i18next";
import PageWrapper from "../PageWrapper";
import ReservationLink from "../ReservationLink";
import type { UserReservation } from "@types";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<UserReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const list = await reservationApi.getUserReservations();
        setReservations(list);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
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
