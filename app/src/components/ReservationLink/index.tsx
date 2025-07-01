import { Link } from "react-router";
import { parseDate, parseTime } from "@utils/dateTime";
import type { UserReservation } from "@types";
import "./ReservationLink.css";

type Props = {
  reservation: UserReservation;
};

/**
 * ReservationLink component renders a link to a reservation details page.
 * It displays the calendar (workpod) ID and the time range of the reservation.
 * @param {Props} props - The component props containing the reservation data.
 * @returns {JSX.Element} The rendered reservation link.
 */
const ReservationLink = ({ reservation }: Props) => {
  const { id, calendarId, start, end } = reservation;

  return (
    <Link
      className="slot"
      to={`/reservations/${calendarId}/${id}`}
      state={{ reservation }}
    >
      <div className="slot-info">
        <h3 className="slot-name">{calendarId}</h3>
        <p className="slot-time">
          {parseDate(start)} {parseTime(start)} - {parseTime(end)}
        </p>
      </div>
    </Link>
  );
};

export default ReservationLink;
