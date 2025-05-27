import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@auth/useAuth";
import PageWrapper from "./PageWrapper";

const LoginPage = () => {
  const { onLogin } = useAuth();

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
    </PageWrapper>
  );
};

export default LoginPage;
