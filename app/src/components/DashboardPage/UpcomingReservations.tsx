import type { UserReservation } from "@types";
import ReservationLink from "../ReservationLink";
import { t } from "i18next";

type Props = {
  reservations: UserReservation[];
};

/**
 * UpcomingReservations component displays a list of the next three upcoming reservations.
 * If there are no upcoming reservations, it shows a message indicating that.
 * @param {Props} props - The component props containing reservations data.
 * @returns {JSX.Element} The rendered list of upcoming reservations or a message if none exist.
 */
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
