import { Routes, Route, Navigate } from "react-router";
import DashboardPage from "./components/DashboardPage/index.tsx";
import InfoPage from "./components/InfoPage/index.tsx";
import LoginPage from "./components/LoginPage.tsx";
import Navbar from "./components/Navbar/index.tsx";
import ProtectedRoute from "./components/ProtectedRoute/index.tsx";
import Reservation from "./components/Reservation/index.tsx";
import Reservations from "./components/Reservations/index.tsx";
import Search from "./components/Search/index.tsx";
import SearchResults from "./components/SearchResults/index.tsx";
import Workpod from "./components/Workpod/index.tsx";
import Workpods from "./components/Workpods/index.tsx";

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

const NotFound = () => <p>There's nothing here: 404!</p>;

export default App;
