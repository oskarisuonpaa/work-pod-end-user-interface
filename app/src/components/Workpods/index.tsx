import "./Workpods.css";
import { Fragment, useEffect, useState } from "react";
import { getWorkpods } from "@utils/BackendCommunication";
import PageWrapper from "../PageWrapper";
import WorkpodLink from "./WorkPodLink";

const Workpods = () => {
  const [workPods, setWorkPods] = useState<string[]>([]);

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
    <PageWrapper pageTitle="Work Pods">
      <div className="work-pods-container">
        {workPods.length !== 0 &&
          workPods.map((pod, idx) => {
            const room = pod.split("-")[0];
            const showSeparator = room !== lastRoom && idx !== 0;
            lastRoom = room;

            return (
              <Fragment key={pod}>
                {showSeparator && <div className="separator"></div>}
                <div className="work-pods-container">
                  <WorkpodLink podID={pod} availability="available" />
                </div>
              </Fragment>
            );
          })}
      </div>
    </PageWrapper>
  );
};

export default Workpods;
