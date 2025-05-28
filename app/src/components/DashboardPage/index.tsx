import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@auth/useAuth";
import { useReservations } from "@hooks/useReservations";
import "./Dashboard.css";
import PageWrapper from "../PageWrapper";
import UpcomingReservations from "./UpcomingReservations";
import ActionButton from "@components/ActionButton";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { reservations, isLoading, error } = useReservations();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated()) return null;

  return (
    <PageWrapper pageTitle={user?.name || "User"}>
      <div className="container">
        <div className="schedule-container">
          <h2>Upcoming Slots</h2>
          {isLoading && <h3>Loading...</h3>}
          {error && <h3 className="error">{error}</h3>}
          {!isLoading && !error && (
            <UpcomingReservations reservations={reservations} />
          )}
        </div>
        <div className="link-container">
          <ul>
            <li>
              <ActionButton label="Workpods" to="/workpods" />
            </li>
            <li>
              <ActionButton label="Read QR" to="#" />
            </li>
            <li>
              <ActionButton label="Reservations" to="/reservations" />
            </li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
