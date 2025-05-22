import { useAuth } from "../AuthProvider";
import "./LoginForm.css";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const { onLogin } = useAuth();

  const onSuccess = (credentialResponse: any) => {
    const token = credentialResponse.credential;
    if (token) {
      onLogin(token);
    }
  };

  return (
    <div className="page-content">
      <div className="form-container">
        <h2>Login</h2>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </div>
  );
};

export default LoginForm;
