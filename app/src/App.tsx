import { Routes, Route, Navigate } from "react-router";
import DashboardPage from "./components/DashboardPage";
import InfoPage from "./components/InfoPage";
import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Reservation from "./components/Reservation";
import Reservations from "./components/Reservations";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import Workpod from "./components/Workpod";
import Workpods from "./components/Workpods";
import { useTranslation } from "react-i18next"

const App = () => {
  return (
    <div className="page-container">
      <Navbar />

      <Routes>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="login" element={<LoginPage />} />

        <Route
          path="workpods"
          element={
            <ProtectedRoute>
              <Workpods />
            </ProtectedRoute>
          }
        />
        <Route
          path="workpods/:workpodId/:date?"
          element={
            <ProtectedRoute>
              <Workpod />
            </ProtectedRoute>
          }
        />
        <Route
          path="search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="searchresults"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />
        <Route path="info" element={<InfoPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="reservations"
          element={
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="reservations/:calendarId/:reservationId"
          element={
            <ProtectedRoute>
              <Reservation />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <NotFound />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};
const NotFound = () => {
  const { t } = useTranslation();
  return (<p>{t("nothing-here")}: 404!</p>
)};

export default App;
