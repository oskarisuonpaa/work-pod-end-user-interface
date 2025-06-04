// ListWorkPod.tsx
import { Link } from "react-router";
import { format } from "date-fns";
import "./ListWorkPod.css";

type Props = {
  workpodId: string;
  date?: Date;
  text: string;
};

const ListWorkPod = ({ workpodId, date, text }: Props) => (
  <li className="lab-arrow">
    <Link to={`/workpods/${workpodId}` + (date ? `/${format(date, "yyyy-MM-dd")}` : "")}>
      <p className="workpod-title">{workpodId}</p>
      <p className="workpod-text">{text}.</p>
    </Link>
  </li>
);

export default ListWorkPod;