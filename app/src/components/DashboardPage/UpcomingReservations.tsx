import type { ReservationType } from "@types";
import ReservationLink from "../ReservationLink";

type Props = {
  reservations: ReservationType[];
};

const UpcomingReservations = ({ reservations }: Props) => {
  const sorted = reservations
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);

  if (sorted.length === 0) return <h4>No upcoming reservations</h4>;

  return (
    <ul>
      {sorted.map((reservation) => (
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
  );
};

export default UpcomingReservations;
