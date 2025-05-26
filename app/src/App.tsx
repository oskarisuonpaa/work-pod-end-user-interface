import { Routes, Route, Navigate } from "react-router";
import LoginScreen from "./components/LoginScreen";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Info from "./components/Info";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import ProtectedRoute from "./components/ProtectedRoute";
import WorkPods from "./components/Workpods";
import Reservations from "./components/Reservations";
import Reservation from "./components/Reservation";
import WorkPod from "./components/Workpod";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <div className="page-container">
      <NavBar />

      <Routes>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="login" element={<LoginScreen />} />

        <Route
          path="workpods"
          element={
            <ProtectedRoute>
              <WorkPods />
            </ProtectedRoute>
          }
        />
        <Route
          path="workpods/:workpodId"
          element={
            <ProtectedRoute>
              <WorkPod />
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
        <Route path="info" element={<Info />} />
        <Route path="login-form" element={<LoginForm />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const NotFound = () => <p>There's nothing here: 404!</p>;

export default App;
