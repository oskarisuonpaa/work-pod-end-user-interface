import { Routes, Route, Link, useParams } from "react-router";
import LoginScreen from "./components/LoginScreen";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import WorkPods from "./components/WorkPods";

// Main App component
const App = () => {
  return (
    <>
      <div>
        <h2>Hello, World!</h2>
      </div>

      <Navigation />

      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginScreen />} />
        <Route path="work-pods" element={<WorkPods />} />
        <Route path="workpods/:workpodId" element={<Workpod />} />
        <Route path="search" element={<Search />} />
        <Route path="searchresults" element={<SearchResults />} />
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
const Home = () => <p>Home page stuff</p>;

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
