import LinkButton from "../LinkButton";
import "./Dashboard.css";
import ReservationLink from "./ReservationLink";

const Dashboard = () => {
  const user = { name: "John Doe" };

  return (
    <>
      <h2>{user.name}</h2>
      <div className="container">
        <div className="schedule-container">
          <h3>Upcoming Slots</h3>
          <ul>
            <li>
              <ReservationLink
                id="C230-1"
                podName="C230-1"
                date="20.5.2025"
                startTime="9:00"
                endTime="10:00"
              />
            </li>
            <li>
              <ReservationLink
                id="C230-2"
                podName="C230-2"
                date="21.5.2025"
                startTime="9:00"
                endTime="10:00"
              />
            </li>
            <li>
              <ReservationLink
                id="C230-3"
                podName="C230-3"
                date="22.5.2025"
                startTime="9:00"
                endTime="10:00"
              />
            </li>
          </ul>
        </div>
        <div className="link-container">
          <ul>
            <li>
              <LinkButton label="Work Pods" to="/workpods" />
            </li>
            <li>
              <LinkButton label="Read QR" to="#" />
            </li>
            <li>
              <LinkButton label="Reservations" to="/reservations" />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
