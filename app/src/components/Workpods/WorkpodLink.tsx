import { Link } from "react-router";
import koppero from "../../assets/koppero.png";
import type { Workpod } from "@types";

const WorkpodLink = ({ alias, status }: Workpod) => {
  return (
    <Link to={"/workpods/" + alias} className="work-pod-link">
      <div className={`hexagon ${status}`}>
        <img src={koppero} alt="Peepo" />
        <p className="work-pod-name">{alias}</p>
      </div>
    </Link>
  );
};

export default WorkpodLink;
