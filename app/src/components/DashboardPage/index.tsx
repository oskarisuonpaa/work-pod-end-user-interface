import { useNavigate } from "react-router";
import { useEffect } from "react";
import LinkButton from "../LinkButton";
import PageWrapper from "../PageWrapper";
import UpcomingReservations from "./UpcomingReservations";
import { useReservations } from "../../hooks/useReservations";
import { useAuth } from "../../auth/useAuth";
import "./Dashboard.css";

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
          <h3>Upcoming Slots</h3>
          {isLoading && <h4>Loading...</h4>}
          {error && <h4 className="error">{error}</h4>}
          {!isLoading && !error && (
            <UpcomingReservations reservations={reservations} />
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
    </PageWrapper>
  );
};

export default DashboardPage;
