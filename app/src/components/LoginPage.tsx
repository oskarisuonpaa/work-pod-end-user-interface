import {
  GoogleLogin,
  useGoogleLogin,
  type CredentialResponse,
  type TokenResponse,
} from "@react-oauth/google";
import { useAuth } from "@auth/useAuth";
import PageWrapper from "./PageWrapper";
import ActionButton from "./ActionButton";
import axios from "axios";

const LoginPage = () => {
  const { onLogin } = useAuth();

  const handleLoginClick = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        const { access_token } = tokenResponse;
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
  });

  const handleSuccess = (response: CredentialResponse) => {
    if (response.credential) {
      onLogin(response.credential);
    } else {
      console.warn("Missing credential in response");
    }
  };

  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <PageWrapper pageTitle="Workpod Scheduler">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} useOneTap />
      <ActionButton
        label="Login with Google"
        className="login-button"
        onClick={handleLoginClick}
      />
    </PageWrapper>
  );
};

export default LoginPage;
