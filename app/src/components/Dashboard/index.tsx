import { FaArrowRight } from "react-icons/fa6";
import LinkButton from "../LinkButton";
import "./Dashboard.css";

const Dashboard = () => {
  const user = { name: "John Doe" };

  /*TODO:
  -Split into subcomponents
  -Connect with backend
  -Make it responsive
  -Make links functional
  */

  return (
    <>
      <h2>{user.name}</h2>
      <div className="container">
        <div className="schedule-container">
          <h3>Upcoming Slots</h3>
          <ul>
            <li>
              <a className="slot" href="#">
                <div>
                  <h3 className="slot-name">C230-1</h3>
                  <p className="slot-time">20.5.2025 9:00 - 10:00</p>
                </div>
                <FaArrowRight />
              </a>
            </li>
            <li>
              <a className="slot" href="#">
                <div>
                  <h3 className="slot-name">C230-2</h3>
                  <p className="slot-time">21.5.2025 9:00 - 10:00</p>
                </div>
                <FaArrowRight />
              </a>
            </li>
            <li>
              <a className="slot" href="#">
                <div>
                  <h3 className="slot-name">C230-3</h3>
                  <p className="slot-time">22.5.2025 9:00 - 10:00</p>
                </div>
                <FaArrowRight />
              </a>
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
              <LinkButton label="Reservations" to="#" />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
