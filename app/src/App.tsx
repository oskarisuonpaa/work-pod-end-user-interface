import { Routes, Route, Link, Navigate } from "react-router";
import LoginScreen from "./components/LoginScreen";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Info from "./components/Info";
import Search from "./components/Search";
import ProtectedRoute from "./components/ProtectedRoute";

// Dummy data
//const pods = [{ id: "C232-1" }, { id: "C232-2" }];

import WorkPods from "./components/WorkPods";
import Reservations from "./components/Reservations";
import Reservation from "./components/Reservation";
import WorkPod from "./components/WorkPod";

// Main App component
const App = () => {
  //const { token } = useAuth(); // initialise token to use when checking auth status

  return (
    <div className="page-container">
      <Navigation />

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
          path="reservations/:reservationId"
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

// Navigation bar
const Navigation = () => {
  return (
    <nav>
      <Link to="/dashboard">Dashboard </Link>
      <Link to="/login">Login </Link>
      <Link to="/workpods">Workpods </Link>
      <Link to="/search">Search </Link>
      <Link to="/searchresults">Search Results </Link>
      <Link to="/info">Info</Link>
    </nav>
  );
};

// Page components

const SearchResults = () => <p>SearchResults page stuff</p>;

const NotFound = () => <p>There's nothing here: 404!</p>;

export default App;
