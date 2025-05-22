import LinkButton from "../LinkButton";
import "./Dashboard.css";
import ReservationLink from "../ReservationLink";
import { useAuth } from "../AuthProvider";
import { jwtDecode } from "jwt-decode";

const dummyData = [
  {
    id: "84ojdg6vpqp8ga0vhs6kkprq9k",
    title: "John Doe",
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

type GoogleJwtPayload = {
  name: string;
  [key: string]: any;
};

const Dashboard = () => {
  const { token } = useAuth();
  if (!token) {
    return (
      <div className="page-content">
        <div className="page-title">
          <h1>Unauthorized</h1>
        </div>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  const decodedToken = jwtDecode<GoogleJwtPayload>(token);
  const user = { name: decodedToken.name };

  const userReservations = dummyData.filter(
    (reservation) => reservation.title === user.name
  );

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>{user.name}</h1>
      </div>
      <div className="container">
        <div className="schedule-container">
          <h3>Upcoming Slots</h3>
          <ul>
            {userReservations
              .sort(
                (a, b) =>
                  new Date(a.start).getTime() - new Date(b.start).getTime()
              )
              .slice(0, 3)
              .map((reservation) => (
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
        <div className="link-container">
          <ul>
            <li>
              <LinkButton label="Work Pods" to="/workpods" />
            </li>
            <li>
              <LinkButton label="Read QR" to="#" />
            </li>
            <li>
              <LinkButton label="Reservations" to="/reservations" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
