import { useEffect, useState } from "react";
import ReservationLink from "../ReservationLink";
import "./Reservations.css";
import { getUserReservations } from "../../utils/BackendCommunication";
import PageWrapper from "../PageWrapper";

type ReservationType = {
  id: string;
  start: string;
  end: string;
  calendarId: string;
};

const Reservations = () => {
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await getUserReservations();
        setReservations(reservations);
        if (isLoading) {
          setIsLoading(false);
        }
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
    <div className="page-content">
      <div className="page-title">
        <h1>Your Reservations</h1>
      </div>
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
    </div>
  );
};

export default Reservations;
