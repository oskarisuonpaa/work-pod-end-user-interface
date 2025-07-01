import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@auth/useAuth";
import { useTranslation } from "react-i18next";
import PageWrapper from "@components/PageWrapper";

/**
 * LoginPage component handles user login using Google OAuth.
 * It uses the GoogleLogin component to authenticate users and calls onLogin from AuthContext on success.
 * @component
 * @returns {JSX.Element} The rendered login page with Google login button.
 * @description This component provides a Google login button that, when clicked, initiates the OAuth flow.
 * On successful authentication, it retrieves the user's credential and calls the onLogin function from the AuthContext.
 * It is used to authenticate users before they can access the application.
 * The page title is set to "Workpod Scheduler" using the i18n translation function
 */
const LoginPage = () => {
  const { onLogin } = useAuth();
  const { t } = useTranslation();

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
    <PageWrapper pageTitle={t("workpod-scheduler")}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="filled_blue"
        size="large"
        text="signin_with"
      />
    </PageWrapper>
  );
};

export default LoginPage;
