import "./Workpods.css";
import PageWrapper from "../PageWrapper";
import WorkpodLink from "./WorkpodLink";
import { useTranslation } from "react-i18next";
import { useWorkpods } from "@hooks/useWorkpods";

const Workpods = () => {
  const { data: workPods = [] } = useWorkpods();
  const { t } = useTranslation();

  const grouped = workPods.reduce((acc, pod) => {
    const [room] = pod.split("-");
    if (!acc[room]) acc[room] = [];
    acc[room].push(pod);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <PageWrapper pageTitle={t("navbar-workpods")}>
      <div className="work-pods-container">
        {Object.entries(grouped).map(([room, pods]) => (
          <div className="room-group" key={room}>
            <h3 className="room-heading">{room}</h3>
            <div className="room-pods">
              {pods.map((pod) => (
                <WorkpodLink key={pod} podID={pod} availability="available" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Workpods;
