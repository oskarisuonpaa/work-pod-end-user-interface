import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router";
import updateWorkPods from "./updateWorkPods.ts";
import PageWrapper from "../PageWrapper";
import "./SearchResults.css";
import { getWorkpodCalendar } from "@utils/backendCommunication.ts";
import type { WorkpodWithEvents } from "@types";
import { useWorkpods } from "@hooks/useWorkpods.ts";

const SearchResults = () => {
  const location = useLocation();
  const { date } = location.state || {};
  const [workPods, setWorkPods] = useState<WorkpodWithEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setDateString] = useState<string>("");
  const [loadedCount, setLoadedCount] = useState(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const { t } = useTranslation();
  const { data: calendars = [] } = useWorkpods();

  // Step 1: Fetch initial workpod list
  useEffect(() => {
    if (!date || isFetching) return;

    const fetchWorkpods = async () => {
      setDateString(date.toISOString());
      setIsFetching(true);

      const pods = Object.values(calendars).map((calendar) => ({
        workpodId: calendar.alias,
        isReserved: false,
        freeFor: 0,
        freeUntil: null,
        events: [],
        reservedUntil: null,
        reservedFor: 0,
      }));

      setWorkPods(pods);
      setHasFetched(true);
    };

    fetchWorkpods();
  }, [date, isFetching, calendars]);

  // Step 2: Fetch calendar events in parallel
  useEffect(() => {
    if (!date || !hasFetched || !loading) return;
    setLoadedCount(0);

    const fetchAllCalendars = async () => {
      const timeMin = date.toISOString();

      const promises = workPods.map((workpod, idx) =>
        getWorkpodCalendar(workpod.workpodId, timeMin)
          .then((data) => ({ data, idx }))
          .catch((error) => {
            console.error("Error fetching calendar:", workpod.workpodId, error);
            return null;
          })
      );

      const results = await Promise.all(promises);

      results.forEach((result) => {
        if (result) {
          setWorkPods((prevPods) =>
            updateWorkPods(prevPods, result.data, date, result.idx)
          );
          setLoadedCount((count) => count + 1);
        }
      });
    };

    fetchAllCalendars();
  }, [hasFetched, date]);

  // Step 3: Mark loading complete
  useEffect(() => {
    if (loadedCount === workPods.length && workPods.length > 0) {
      setLoading(false);
    }
  }, [loadedCount, workPods.length]);

  // Step 4: Render available and reserved pods
  const workPodsAvailable = workPods
    .filter((workpod) => !workpod.isReserved)
    .sort((a, b) => b.freeFor - a.freeFor)
    .map((workpod, idx) => {
      const freeUntil = workpod.freeUntil
        ? format(workpod.freeUntil, "HH:mm")
        : "N/A";
      return (
        <li key={idx} className="lab-arrow">
          <Link
            to={`/workpods/${workpod.workpodId}/${format(date, "yyyy-MM-dd")}`}
          >
            <p className="workpod-title">{workpod.workpodId}</p>
            <p className="workpod-time">
              {t("searchresults-freeuntil", { time: freeUntil })}.
            </p>
          </Link>
        </li>
      );
    });

  const workPodsReserved = workPods
    .filter((workpod) => workpod.isReserved)
    .sort((a, b) => b.reservedFor - a.reservedFor)
    .map((workpod, idx) => {
      const reservedUntil = workpod.reservedUntil
        ? format(workpod.reservedUntil, "HH:mm")
        : "N/A";
      return (
        <li key={idx} className="lab-arrow">
          <Link
            to={`/workpods/${workpod.workpodId}/${format(date, "yyyy-MM-dd")}`}
          >
            <p className="workpod-title">{workpod.workpodId}</p>
            <p className="workpod-time">
              {t("searchresults-reserveduntil", { time: reservedUntil })}.
            </p>
          </Link>
        </li>
      );
    });

  if (!date) return <div>{t("searchresults-no-date")}.</div>;
  if (loading) return <div>{t("loading")}...</div>;

  return (
    <PageWrapper pageTitle={t("searchresults-title")}>
      <p className="search-results">
        {t("searchresults-text1")} {format(date, "dd/MM/yyyy HH:mm")}:
      </p>
      <div className="results">
        <ul className="available-results">{workPodsAvailable}</ul>
        <ul className="reserved-results">{workPodsReserved}</ul>
      </div>
    </PageWrapper>
  );
};

export default SearchResults;
