import { Routes, Route, Link, useParams } from "react-router";
import LoginScreen from "./components/LoginScreen";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import { AuthProvider, useAuth} from "./components/AuthProvider"
import ProtectedRoute from "./components/ProtectedRoute"
import WorkPods from "./components/WorkPods";


// Main App component
const App = () => {
  //const { token } = useAuth(); // initialise token to use when checking auth status

  return (
    <>
      <AuthProvider>
        <Navigation />

      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginScreen />} />
        
        <Route path="work-pods" element={<ProtectedRoute><WorkPods /></ProtectedRoute>} />
        <Route path="workpods/:workpodId" element={<ProtectedRoute><WorkPods /></ProtectedRoute>} />
        <Route path="search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="searchresults" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
        <Route path="info" element={<Info />} />
        <Route path="login-form" element={<LoginForm />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// Navigation bar
const Navigation = () => {
  return (
    <nav>
      <Link to="/">Home </Link>
      <Link to="/login">Login </Link>
      <Link to="/work-pods">Workpods </Link>
      <Link to="/search">Search </Link>
      <Link to="/searchresults">Search Results </Link>
      <Link to="/info">Info</Link>
    </nav>
  );
};

// Page components
const Home = () => {
  const { onLogin } = useAuth();
  // I put login button here because it wasn't working in the App function
  // TODO remove login button and implement elsewhere, fix auth etc
  return (
    <p>
      Home page stuff
      <br />
      <button type="button" onClick={onLogin}>
        Sign In
      </button>
    </p>
  );
};

const Info = () => <p>Info page stuff</p>;

const Search = () => <p>Search page stuff</p>;

const SearchResults = () => <p>SearchResults page stuff</p>;

const NotFound = () => <p>There's nothing here: 404!</p>;

// Workpods page
type Pod = {
  id: string;
};

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
