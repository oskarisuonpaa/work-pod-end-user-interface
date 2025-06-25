import type { UserReservation } from "@types";
import ReservationLink from "../ReservationLink";
import { t } from "i18next";

type Props = {
  reservations: UserReservation[];
};

const UpcomingReservations = ({ reservations }: Props) => {
  const sorted = reservations
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);

  if (sorted.length === 0) return <h4>{t("dashboard-no-upcoming")}</h4>;

  return (
    <ul>
      {sorted.map((reservation) => (
        <li key={reservation.id}>
          <ReservationLink reservation={reservation} />
        </li>
      ))}
    </ul>
  );
};

export default UpcomingReservations;
