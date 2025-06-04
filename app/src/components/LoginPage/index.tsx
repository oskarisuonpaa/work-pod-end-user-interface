import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@auth/useAuth";
import { useTranslation } from "react-i18next";
import PageWrapper from "@components/PageWrapper";

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
