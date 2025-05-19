import { Routes, Route, Link, useParams } from 'react-router';

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
      <Route path="workpods" element={<Workpods pods={pods}/>} />
      <Route path="workpods/:workpodId" element={<Workpod /> } />
      
      <Route path="search" element={<Search /> } />
      <Route path="searchResults" element={<SearchResults />} />
      <Route path="info" element={<Info /> } />
      <Route path="*" element={<NotFound /> } />
    </Routes>
    </>
  );
// use <Link to="path"> for navigation to routes
const Navigation = () => {
  return (
    <nav>
      <Link to="/">Home </Link>
      <Link to="/login">Login </Link>
      <Link to="/workpods">Workpods </Link>
      <Link to="/search">search </Link>
      <Link to="/searchresults">search results </Link>
      <Link to="/info">Info</Link>
    </nav>
  );
};
// move these to their own components, just examples to get routing working
const Info = () => {
  return (<p>Info page stuff</p>);
};
type Pod = {
  id: string;
};

type PodsProps = {
  pods: Pod[];
};
const pods = [
  {id: "C232-1"},
  {id: "C232-2"}
]
const Workpods = ({pods}: PodsProps) => {
  return (<>      <h2>Workpods</h2>

      <ul>
        {pods.map((pod) => (
          <li key={pod.id}>
            <Link to={`/workpods/${pod.id}`}>Workpod {pod.id}</Link>
          </li>
        ))}
      </ul>
      </>)
};

const Workpod = () => {
  const { workpodId } = useParams();

  return (
    <>
      <h2>Workpod: {workpodId}</h2>

      <Link to="/workpods">Back to Workpods</Link>
    </>
  );
};

const Home = () => {
  return (<p>Home page stuff</p>);
};

const Login = () => {
  return (<p>Login page stuff</p>);
};
const Search = () => {
  return (<p>Search page stuff</p>);
};
const SearchResults = () => {
  return (<p>SearchResults page stuff</p>);
};


const NotFound = () => {
  return (<p>There's nothing here: 404!</p>);
};
export default App;
