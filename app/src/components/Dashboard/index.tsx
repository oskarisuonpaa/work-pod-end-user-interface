import LinkButton from "../LinkButton";
import "./Dashboard.css";
import ReservationLink from "../ReservationLink";
import { useAuth } from "../AuthProvider";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getUserReservations();
        setReservations(data);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("Failed to load reservations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (!token) return null;

  let userName = "User";
  try {
    const decodedToken = jwtDecode<GoogleJwtPayload>(token);
    userName = decodedToken.name || "User";
  } catch {
    console.warn("Invalid token");
    navigate("/login");
    return null;
  }

  const upcomingReservations = useMemo(() => {
    return reservations
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 3);
  }, [reservations]);

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>{userName}</h1>
      </div>
      <div className="container">
        <div className="schedule-container">
          <h3>Upcoming Slots</h3>
          {isLoading && <h4>Loading...</h4>}
          {error && <h4 className="error">{error}</h4>}
          {!isLoading && reservations.length === 0 && !error && (
            <h4>No upcoming reservations</h4>
          )}
          {upcomingReservations.length > 0 && (
            <ul>
              {upcomingReservations.map((reservation) => (
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
          )}
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
