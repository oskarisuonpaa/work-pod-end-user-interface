import { Link } from "react-router";
import peepo from "../../assets/placeholder-pepe.jpg";

export const Availability = {
  Available: "available",
  HasSlots: "has-slots",
  FullyBooked: "fully-booked",
} as const;

type Availability = (typeof Availability)[keyof typeof Availability];

type WorkpodLinkProps = {
  podID: string;
  availability: Availability;
};

const WorkpodLink = ({ podID, availability }: WorkpodLinkProps) => {
  return (
    <Link to={"/workpods/" + podID} className="work-pod-link">
      <div className={`hexagon ${availability}`}>
        <img src={peepo} alt="Peepo" />
        <p className="work-pod-name">{podID}</p>
      </div>
    </Link>
  );
};

export default WorkpodLink;
