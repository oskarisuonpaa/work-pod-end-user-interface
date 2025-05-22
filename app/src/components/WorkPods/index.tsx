import "./WorkPods.css";
import WorkPodLink from "./WorkPodLink";
import { Fragment, useEffect, useState } from "react";

import { getWorkpods } from "../../utils/BackendCommunication";

const WorkPods = () => {
  const [workPods, setWorkPods] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkpods = async () => {
      try {
        const data = await getWorkpods();
        setWorkPods(data.calendars);
      } catch (error) {
        console.error("Error fetching workpods:", error);
      }
    };
    fetchWorkpods();
  }, []);

  let lastRoom = "";

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>Work Pods</h1>
        <div className="work-pods-container">
          {workPods.length != 0 &&
            workPods.map((pod, idx) => {
              const room = pod.split("-")[0];
              const showSeparator = room !== lastRoom && idx !== 0;
              lastRoom = room;
              return (
                <Fragment key={pod}>
                  {showSeparator && <div className="separator"></div>}
                  <div className="work-pods-container">
                    <WorkPodLink podID={pod} availability={"available"} />
                  </div>
                </Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default WorkPods;
