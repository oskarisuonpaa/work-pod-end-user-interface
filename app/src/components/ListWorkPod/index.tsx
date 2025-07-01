// ListWorkPod.tsx
import { Link } from "react-router";
import { format } from "date-fns";
import "./ListWorkPod.css";

type Props = {
  workpodId: string;
  date?: Date;
  text: string;
};

/**
 * ListWorkPod component renders a list item with a link to a work pod.
 * It displays the work pod ID and an optional date formatted as "yyyy-MM-dd".
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.workpodId - The ID of the work pod.
 * @param {Date} [props.date] - The date associated with the work pod (optional).
 * @param {string} props.text - The text description of the work pod.
 * @returns {JSX.Element} The rendered list item with a link.
 * @description This component is used to display a work pod in a list format.
 * It includes a link to the work pod's detail page, which can optionally include a date.
 */
const ListWorkPod = ({ workpodId, date, text }: Props) => (
  <li className="lab-arrow">
    <Link to={`/workpods/${workpodId}` + (date ? `/${format(date, "yyyy-MM-dd")}` : "")}>
      <p className="workpod-title">{workpodId}</p>
      <p className="workpod-text">{text}.</p>
    </Link>
  </li>
);

export default ListWorkPod;