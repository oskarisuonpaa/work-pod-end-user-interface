import LoginScreen from "./components/LoginScreen";

const App = () => {
  const loggedIn = false;
  return (
    <>
      {loggedIn ? <h2>Welcome to the Work Pod Scheduler</h2> : <LoginScreen />}
    </>
  );
};

export default App;
