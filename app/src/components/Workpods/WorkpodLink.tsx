import { Link } from "react-router";
import koppero from "../../assets/koppero.png";
import type { Workpod } from "@types";

const WorkpodLink = ({ alias, status }: Workpod) => {
  return (
    <Link to={"/workpods/" + alias} className="work-pod-link">
      <div className={`hexagon ${status}`}>
        <p className="work-pod-name">{alias}</p>
        <img src={koppero} alt="Workpod" />
        <p className="availability-timeframe"> 24H</p>
      </div>
    </Link>
  );
};

export default WorkpodLink;
