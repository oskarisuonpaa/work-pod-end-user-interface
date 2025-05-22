import { useNavigate, useParams } from "react-router";
import "./Reservation.css";
import { parseDate, parseTime } from "../../utils/DateTimeParsing";

const dummyData = [
  {
    id: "84ojdg6vpqp8ga0vhs6kkprq9k",
    title: "Joel Ryynänen",
    start: "2025-05-19T12:15:00+03:00",
    end: "2025-05-19T13:15:00+03:00",
    allDay: false,
    url: "https://www.google.com/calendar/event?someurl",
  },
  {
    id: "qk5iht3g5fdu65r5snlt9p97ec",
    title: "Varattu",
    start: "2025-05-21T05:00:00+03:00",
    end: "2025-05-21T06:00:00+03:00",
    allDay: false,
    url: "https://www.google.com/calendar/event?someurl",
  },
];

const Reservation = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();

  const reservation = dummyData.find((res) => res.id === reservationId);

  if (!reservation) {
    return (
      <div className="page-content">
        <div className="page-title">
          <h1>Reservation Not Found</h1>
        </div>
        <p>The reservation you are looking for does not exist.</p>
      </div>
    );
  }

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      alert(`Reservation ${reservationId} cancelled.`);
      navigate("/reservations");
    }
  };

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>Reservation Info</h1>
      </div>
      <div className="reservation-info">
        <h2>Work Pod: C230-1</h2>
        <p className="date-info">Date: {parseDate(reservation.start)}</p>
        <p className="time-info">
          Time: {parseTime(reservation.start)} - {parseTime(reservation.end)}
        </p>
      </div>
      <button className="cancel-button" onClick={handleCancel}>
        Cancel Reservation
      </button>
    </div>
  );
};

export default Reservation;
