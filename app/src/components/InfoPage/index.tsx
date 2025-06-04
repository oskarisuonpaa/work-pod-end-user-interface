import { useAuth } from "@auth/useAuth.ts";
import PageWrapper from "@components/PageWrapper";
import "./Info.css";
import ActionButton from "@components/ActionButton";
import { useTranslation } from "react-i18next";

const InfoPage = () => {
  const { isAuthenticated } = useAuth();
  const loggedIn = isAuthenticated();
  const { t } = useTranslation();

  return (
    <PageWrapper pageTitle={"Info - " + t("info-title")}>
      {!loggedIn && (
        <p>
          {t("info-access-text")}
          <br />
          <ActionButton label={t("navbar-login")} to="/login" />
        </p>
      )}

      <p>{t("info-text1")}</p>

      <p>{t("info-text2")}</p>
    </PageWrapper>
  );
};

export default InfoPage;
