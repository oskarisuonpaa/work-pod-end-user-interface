import LinkButton from "../LinkButton";
import "./Dashboard.css";
import ReservationLink from "../ReservationLink";
import { useAuth } from "../AuthProvider";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getUserReservations } from "../../utils/BackendCommunication";

type GoogleJwtPayload = {
  name: string;
  [key: string]: any;
};

type ReservationType = {
  id: string;
  start: string;
  end: string;
  calendarId: string;
};

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationType[]>([]);

  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await getUserReservations();
        setReservations(reservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  const decodedToken = jwtDecode<GoogleJwtPayload>(token);
  const user = { name: decodedToken.name };

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>{user.name}</h1>
      </div>
      <div className="container">
        <div className="schedule-container">
          <h3>Upcoming Slots</h3>
          <ul>
            {reservations
              .sort(
                (a, b) =>
                  new Date(a.start).getTime() - new Date(b.start).getTime()
              )
              .slice(0, 3)
              .map((reservation) => (
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
