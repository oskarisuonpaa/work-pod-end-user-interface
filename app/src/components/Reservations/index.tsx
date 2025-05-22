import ReservationLink from "../ReservationLink";
import "./Reservations.css";

const dummyData = [
  {
    id: "84ojdg6vpqp8ga0vhs6kkprq9k",
    title: "John Doe",
    start: "2025-05-19T12:15:00+03:00",
    end: "2025-05-19T13:15:00+03:00",
    allDay: false,
    url: "https://www.google.com/calendar/event?someurl",
  },
];

const Reservations = () => {
  return (
    <div className="page-content">
      <div className="page-title">
        <h1>Your Reservations</h1>
      </div>
      <div className="reservations-container">
        <ul>
          {dummyData.map((reservation) => (
            <li key={reservation.id}>
              <ReservationLink
                id={reservation.id}
                podName="C230-1"
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
