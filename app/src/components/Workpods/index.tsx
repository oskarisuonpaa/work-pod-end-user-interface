import "./Workpods.css";
import PageWrapper from "../PageWrapper";
import WorkpodLink from "./WorkpodLink";
import { useTranslation } from "react-i18next";
import type { Workpod } from "@types";
import useWorkpods from "@hooks/useWorkpods";

/**
 * Workpods component displays a list of work pods grouped by room.
 * It fetches work pod data and renders links to each pod with its status.
 * @component
 * @returns {JSX.Element} The rendered work pods grouped by room.
 * @description This component fetches work pod data, groups them by room,
 * and displays them with their current status (free, busy, unknown).
 */
const Workpods = () => {
  const { data: workPods = [] } = useWorkpods();
  const { t } = useTranslation();

  const grouped = workPods.reduce(
    (acc: Record<string, Workpod[]>, pod: Workpod) => {
      const room = pod.alias.split("-")[0];
      if (!acc[room]) acc[room] = [];
      acc[room].push(pod);
      return acc;
    },
    {} as Record<string, Workpod[]>
  );

  return (
    <PageWrapper pageTitle={t("navbar-workpods")}>
      <p>
        {t("workpod-status-legend")}: <span className="free">{t("free")}</span>{" "}
        <span className="busy">{t("busy")}</span>{" "}
        <span className="unknown">{t("unknown")}</span>
      </p>
      <div className="work-pods-container">
        {Object.entries(grouped).map(([room, pods]) => (
          <div className="room-group" key={room}>
            <h3 className="room-heading">{room}</h3>
            <div className="room-pods">
              {pods.map((pod) => (
                <WorkpodLink
                  key={pod.alias}
                  alias={pod.alias}
                  status={pod.status}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Workpods;
