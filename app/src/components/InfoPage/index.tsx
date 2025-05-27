import { useAuth } from "@auth/useAuth.ts";
import LinkButton from "../LinkButton";
import PageWrapper from "../PageWrapper";
import "./Info.css";

const InfoPage = () => {
  const { isAuthenticated } = useAuth();
  const loggedIn = isAuthenticated();

  return (
    <PageWrapper pageTitle="Info - Workpod Reservation System">
      {!loggedIn && (
        <p>
          Note: access is for authorized users only; log in using LAB/LUT
          credentials.
          <br />
          <LinkButton label="Login" to="/login" />
        </p>
      )}

      <p>
        To reserve a work pod, select a work pod from the workpods page, or
        search for an available work pod using the search page. You can view
        your reservations on the dashboard page.
      </p>

      <p>
        To cancel a reservation, go to the dashboard page and select the
        reservation you want to cancel. Please cancel your reservation if you no
        longer need it to make it available for another user.
      </p>
    </PageWrapper>
  );
};

export default InfoPage;
