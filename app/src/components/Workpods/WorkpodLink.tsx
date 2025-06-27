import { Link } from "react-router";
import koppero from "../../assets/koppero.png";
import type { Workpod } from "@types";
import { useEffect, useState } from "react";
import { getWorkpodCalendar } from "api/workpods";
import { getWorkpodAvailability } from "../SearchResults/getWorkpodAvailability";
import type { WorkpodAvailability } from "../SearchResults/getWorkpodAvailability";
import { format } from "date-fns";


const WorkpodLink = ({ alias, status }: Workpod) => {
    const [availability, setAvailability] = useState<WorkpodAvailability | null>(null);

useEffect(() => {
  const fetchAvailability = async () => {
    try {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59);
      const events = await getWorkpodCalendar(alias, now.toISOString(), endOfDay.toISOString());
      const avail = getWorkpodAvailability(events, now);
      setAvailability(avail);
    } catch (error) {
      setAvailability(null); // or set some error state
      console.error("Error fetching workpod availability:", error);
    }
  };
  fetchAvailability();
}, [alias]);

  return (
    <Link to={"/workpods/" + alias} className="work-pod-link">
      <div className={`hexagon ${status}`}>
        <p className="work-pod-name">{alias}</p>
        <img src={koppero} alt="Workpod" />
        <p className="availability-timeframe">
          {availability
            ? availability.isReserved
              ? `${format(availability.reservedUntil!, "HH:mm")}}`
              : `${format(availability.freeUntil!, "HH:mm")}`
            : ""}
        </p>
      </div>
    </Link>
  );
};

export default WorkpodLink;
