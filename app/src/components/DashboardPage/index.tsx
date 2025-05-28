import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@auth/useAuth";
import { useReservations } from "@hooks/useReservations";
import "./Dashboard.css";
import LinkButton from "../LinkButton";
import PageWrapper from "../PageWrapper";
import UpcomingReservations from "./UpcomingReservations";
import { useTranslation } from "react-i18next"

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { reservations, isLoading, error } = useReservations();
  const { t } = useTranslation();

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
          <h3>{t("dashboard-upcoming")}</h3>
          {isLoading && <h4>{t("loading")}...</h4>}
          {error && <h4 className="error">{error}</h4>}
          {!isLoading && !error && (
            <UpcomingReservations reservations={reservations} />
          )}
        </div>
        <div className="link-container">
          <ul>
            <li>
              <LinkButton label={t("navbar-workpods")} to="/workpods" />
            </li>
            <li>
              <LinkButton label={t("dashboard-readQR")} to="#" />
            </li>
            <li>
              <LinkButton label={t("navbar-reservations")} to="/reservations" />
            </li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
