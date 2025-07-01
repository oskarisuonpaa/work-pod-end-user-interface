import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@auth/useAuth";
import useReservations from "@hooks/useReservations";
import "./Dashboard.css";
import PageWrapper from "../PageWrapper";
import UpcomingReservations from "./UpcomingReservations";
import { useTranslation } from "react-i18next";
import ActionButton from "@components/ActionButton";

/**
 * DashboardPage component displays the user's dashboard with upcoming reservations and navigation links.
 * It checks if the user is authenticated and redirects to the login page if not.
 * @returns {JSX.Element} The rendered dashboard page.
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: reservations, isLoading, error } = useReservations();
  const { t } = useTranslation();

  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      navigate("/login");
    }
  }, [authenticated, navigate]);

  if (!authenticated) return null;

  return (
    <PageWrapper pageTitle={user?.name ?? t("dashboard-title-default")}>
      <div className="container">
        <div className="schedule-container">
          <h2>{t("dashboard-upcoming")}</h2>
          {isLoading && <h3>{t("loading")}...</h3>}
          {error && (
            <h3 className="error">{t("error-fetching-reservations")}</h3>
          )}
          {!isLoading && !error && (
            <UpcomingReservations reservations={reservations ?? []} />
          )}
        </div>
        <div className="link-container">
          <ul>
            <li>
              <ActionButton label={t("navbar-search")} to="/search" />
            </li>
            <li>
              <ActionButton label={t("navbar-workpods")} to="/workpods" />
            </li>
            <li>
              <ActionButton
                label={t("navbar-reservations")}
                to="/reservations"
              />
            </li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
