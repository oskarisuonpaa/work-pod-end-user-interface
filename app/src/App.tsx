import { Routes, Route, Link, useParams, Navigate } from "react-router";
import LoginScreen from "./components/LoginScreen";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./components/AuthProvider";

// Dummy data
//const pods = [{ id: "C232-1" }, { id: "C232-2" }];

import WorkPods from "./components/WorkPods";

// Main App component
const App = () => {
  //const { token } = useAuth(); // initialise token to use when checking auth status

  return (
    <>
      <AuthProvider>
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </>
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

const Info = () => <p>Info page stuff</p>;

const Search = () => <p>Search page stuff</p>;

const SearchResults = () => <p>SearchResults page stuff</p>;

const NotFound = () => <p>There's nothing here: 404!</p>;

// Single Workpod view
const Workpod = () => {
  const { workpodId } = useParams<{ workpodId: string }>();

  return (
    <>
      <h2>Workpod: {workpodId}</h2>
      <Link to="/workpods">Back to Workpods</Link>
    </>
  );
};

export default App;
