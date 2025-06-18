import { Link } from "react-router";
import peepo from "../../assets/placeholder-pepe.jpg";
import type { Workpod } from "@types";

const WorkpodLink = ({ alias, status }: Workpod) => {
  return (
    <Link to={"/workpods/" + alias} className="work-pod-link">
      <div className={`hexagon ${status}`}>
        <img src={peepo} alt="Peepo" />
        <p className="work-pod-name">{alias}</p>
      </div>
    </Link>
  );
};

export default WorkpodLink;
