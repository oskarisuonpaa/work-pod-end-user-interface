import LinkButton from "./LinkButton";

const LoginScreen = () => {
  return (
    <div className="page-content">
      <div className="page-title">
        <h1>Work Pod Scheduler</h1>
      </div>
      <LinkButton label="Login" to="/login-form" />
    </div>
  );
};

export default LoginScreen;
