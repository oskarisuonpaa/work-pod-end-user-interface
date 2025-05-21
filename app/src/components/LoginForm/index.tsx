import { FaArrowRight } from "react-icons/fa6";
import "./LoginForm.css";
import { useAuth } from "../AuthProvider";

const LoginForm = () => {
  const { onLogin } = useAuth();
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const { email, password } = event.target as HTMLFormElement;
    console.log("Email:", email.value);
    console.log("Password:", password.value);
    onLogin();
  };

  return (
    <div className="page-content">
      <div className="form-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="login-button">
              <span>Login</span>
              <FaArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
