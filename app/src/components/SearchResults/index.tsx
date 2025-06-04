import { format, setSeconds, setMinutes, setHours } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import updateAllWorkPods from "./updateWorkPods.ts";
import PageWrapper from "../PageWrapper";
import "./SearchResults.css";
import { getWorkpodCalendar } from "@utils/backendCommunication.ts";
import type { WorkpodWithEvents } from "@types";
import { useWorkpods } from "@hooks/useWorkpods.ts";
import ListWorkPod from "../ListWorkPod";

const SearchResults = () => {
  const location = useLocation();
  const { date } = location.state || {};
  const [workPods, setWorkPods] = useState<WorkpodWithEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const { t } = useTranslation();
  const { data: calendars = [], isError } = useWorkpods();

  // Step 1: Fetch initial workpod list
  useEffect(() => {
    if (!date || isFetching || calendars.length === 0) return;

    const fetchWorkpods = async () => {
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
      console.log(calendars);

    };

    fetchWorkpods();
  }, [calendars]);

  // Step 2: Fetch calendar events in parallel
  useEffect(() => {
    if (!date || !hasFetched || !loading) return;

    const fetchAllCalendars = async () => {
      try {
        const timeMin = date.toISOString();
        const endOfDayLocal = setSeconds(setMinutes(setHours(date, 23), 59), 59);
        const timeMax = endOfDayLocal.toISOString();

        const promises = workPods.map((workpod, idx) =>
          getWorkpodCalendar(workpod.workpodId, timeMin, timeMax)
            .then((data) => ({ data, idx }))
            .catch((error) => {
              console.error("Error fetching calendar:", workpod.workpodId, error);
              return null;
            })
        );

        const results = await Promise.all(promises);

        setWorkPods(prevPods => updateAllWorkPods(prevPods, results, date));
        setLoadedCount(results.filter(Boolean).length);
      } catch (error) {
        console.error("Error fetching all calendars:", error);
      }
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
    .map((workpod) => {
      const freeUntil = workpod.freeUntil
        ? format(workpod.freeUntil, "HH:mm")
        : "N/A";
      return (
        <ListWorkPod
          key={workpod.workpodId}
          workpodId={workpod.workpodId}
          date={date}
          text={t("searchresults-freeuntil", { time: freeUntil })}
        />
      );
    });

  const workPodsReserved = workPods
    .filter((workpod) => workpod.isReserved)
    .sort((a, b) => b.reservedFor - a.reservedFor)
    .map((workpod) => {
      const reservedUntil = workpod.reservedUntil
        ? format(workpod.reservedUntil, "HH:mm")
        : "N/A";
      return (
        <ListWorkPod
          key={workpod.workpodId}
          workpodId={workpod.workpodId}
          date={date}
          text={t("searchresults-reserveduntil", { time: reservedUntil })}
        />
      );
    });

  if (isError) {
    return (
      <PageWrapper pageTitle={t("searchresults-title")}>
        <div className="error-message">
          {t("searchresults-error")}
        </div>
      </PageWrapper>
    );
  }
  if (!date) return (<PageWrapper pageTitle={t("searchresults-title")}><div>{t("searchresults-no-date")}.</div></PageWrapper>);
  if (loading) return (
    <PageWrapper pageTitle={t("searchresults-title")}>
      <div className="loading"><p>{t("loading")}...</p>
        <ul className="skeleton-list">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="skeleton-item"><p>{t("loading")}</p></li>
          ))}
        </ul>
      </div>
    </PageWrapper>);

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
