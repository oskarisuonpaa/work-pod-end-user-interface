import { useEffect, useState } from "react";
import "./Reservations.css";
import { getUserReservations } from "@utils/backendCommunication";
import PageWrapper from "../PageWrapper/index";
import ReservationLink from "../ReservationLink";

type ReservationType = {
  id: string;
  start: string;
  end: string;
  calendarId: string;
};

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await getUserReservations();
        setReservations(reservations);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  if (isLoading) {
    return <PageWrapper pageTitle="Loading..."></PageWrapper>;
  }

  if (reservations.length === 0) {
    return <PageWrapper pageTitle="No Reservations Found"></PageWrapper>;
  }

  return (
    <PageWrapper pageTitle="Your Reservations">
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
