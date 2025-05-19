import { Routes, Route, Link, useParams } from "react-router";

// Dummy data
const pods = [{ id: "C232-1" }, { id: "C232-2" }];

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
        <Route path="login" element={<Login />} />
        <Route path="workpods" element={<Workpods pods={pods} />} />
        <Route path="workpods/:workpodId" element={<Workpod />} />
        <Route path="search" element={<Search />} />
        <Route path="searchresults" element={<SearchResults />} />
        <Route path="info" element={<Info />} />
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
      <Link to="/workpods">Workpods </Link>
      <Link to="/search">Search </Link>
      <Link to="/searchresults">Search Results </Link>
      <Link to="/info">Info</Link>
    </nav>
  );
};

// Page components
const Home = () => <p>Home page stuff</p>;

const Login = () => <p>Login page stuff</p>;

const Info = () => <p>Info page stuff</p>;

const Search = () => <p>Search page stuff</p>;

const SearchResults = () => <p>SearchResults page stuff</p>;

const NotFound = () => <p>There's nothing here: 404!</p>;

// Workpods page
type Pod = {
  id: string;
};

type PodsProps = {
  pods: Pod[];
};

const Workpods = ({ pods }: PodsProps) => {
  return (
    <>
      <h2>Workpods</h2>
      <ul>
        {pods.map((pod) => (
          <li key={pod.id}>
            <Link to={`/workpods/${pod.id}`}>Workpod {pod.id}</Link>
          </li>
        ))}
      </ul>
    </>
  );
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
