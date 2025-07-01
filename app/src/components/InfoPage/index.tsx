import { useAuth } from "@auth/useAuth.ts";
import PageWrapper from "@components/PageWrapper";
import "./Info.css";
import ActionButton from "@components/ActionButton";
import { useTranslation } from "react-i18next";

/**
 * InfoPage component that displays information about the application.
 * @component
 * @returns {JSX.Element}
 * @description This component provides information about the application and its usage.
 * It includes a message for unauthenticated users to log in.
 */
const InfoPage = () => {
  const { isAuthenticated } = useAuth();
  const loggedIn = isAuthenticated();
  const { t } = useTranslation();

  return (
    <PageWrapper pageTitle={"Info - " + t("info-title")}>
      {!loggedIn && (
        <p className="info-text">
          {t("info-access-text")}
          <br />
          <ActionButton label={t("navbar-login")} to="/login" />
        </p>
      )}

      <p className="info-text">{t("info-text1")}</p>

      <p className="info-text">{t("info-text2")}</p>
    </PageWrapper>
  );
};

export default InfoPage;
