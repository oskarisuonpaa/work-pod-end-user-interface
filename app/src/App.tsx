import Dashboard from "./components/Dashboard";
import LoginScreen from "./components/LoginScreen";

const App = () => {
  const loggedIn = true;
  return <>{loggedIn ? <Dashboard /> : <LoginScreen />}</>;
};

export default App;
