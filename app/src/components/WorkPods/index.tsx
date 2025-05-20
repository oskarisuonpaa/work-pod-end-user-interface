import "./WorkPods.css";
import WorkPodLink from "./WorkPodLink";
import React from "react";

import { Availability } from "./WorkPodLink";

const dummyData: {
  id: string;
  availability: (typeof Availability)[keyof typeof Availability];
}[] = [
  { id: "C230-1", availability: Availability.Available },
  { id: "C230-2", availability: Availability.HasSlots },
  { id: "C230-3", availability: Availability.FullyBooked },
  { id: "C242-1", availability: Availability.Available },
  { id: "C242-2", availability: Availability.HasSlots },
];

const WorkPods = () => {
  let lastRoom = "";
  return (
    <>
      <h1>Work Pods</h1>
      <div className="work-pods-container">
        {dummyData.map((pod, idx) => {
          const room = pod.id.split("-")[0];
          const showSeparator = room !== lastRoom && idx !== 0;
          lastRoom = room;
          return (
            <React.Fragment key={pod.id}>
              {showSeparator && <div className="separator"></div>}
              <div className="work-pods-container">
                <WorkPodLink podID={pod.id} availability={pod.availability} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default WorkPods;
