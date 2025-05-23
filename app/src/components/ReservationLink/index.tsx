import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router";
import "./ReservationLink.css";
import { parseDate, parseTime } from "../../utils/DateTimeParsing";

type ReservationLinkProps = {
  id: string;
  podName: string;
  date: string;
  startTime: string;
  endTime: string;
};

const ReservationLink = ({
  id,
  podName,
  date,
  startTime,
  endTime,
}: ReservationLinkProps) => {
  return (
    <Link className="slot" to={`/reservations/${podName}/${id}`}>
      <div className="slot-info">
        <h3 className="slot-name">{podName}</h3>
        <p className="slot-time">
          {parseDate(date)} {parseTime(startTime)} - {parseTime(endTime)}
        </p>
      </div>
      <FaArrowRight />
    </Link>
  );
};

export default ReservationLink;
