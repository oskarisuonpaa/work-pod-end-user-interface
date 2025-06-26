import { Link } from "react-router";
import { parseDate, parseTime } from "@utils/dateTime";
import type { UserReservation } from "@types";
import "./ReservationLink.css";

type Props = {
  reservation: UserReservation;
};

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
