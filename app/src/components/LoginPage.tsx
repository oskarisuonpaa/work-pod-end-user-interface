import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
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

        console.log("Access Token:", access_token);
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
  });

  return (
    <PageWrapper pageTitle="Workpod Scheduler">
      <ActionButton
        label="Login with Google"
        className="login-button"
        onClick={handleLoginClick}
      />
    </PageWrapper>
  );
};

export default LoginPage;
