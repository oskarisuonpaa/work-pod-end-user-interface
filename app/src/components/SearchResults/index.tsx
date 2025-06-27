import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import updateAllWorkPods from "./updateWorkPods.ts";
import PageWrapper from "../PageWrapper";
import "./SearchResults.css";
import type { WorkpodWithEvents } from "@types";
import ListWorkPod from "../ListWorkPod";
import ActionButton from "../ActionButton";
import useWorkpods from "@hooks/useWorkpods.ts";
import { getWorkpodCalendar } from "api/workpods.ts";

const TIMEOUT_MS = 30000; // 30 seconds

const SearchResults = () => {
  const location = useLocation();
  const { date } = location.state || {};
  const [workPods, setWorkPods] = useState<WorkpodWithEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);
  const { t } = useTranslation();
  const { data: calendars = [], isError } = useWorkpods();
  const [workpodError, setWorkpodError] = useState<boolean>(false);

  // Timeout effect so it's not left hanging in loading state indefinitely
  useEffect(() => {
    if (!loading) return;
    setTimedOut(false);
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [loading, retryCount]);

  // Step 1: Fetch initial workpod list
  useEffect(() => {
    if (!date || calendars.length === 0) return;

    let cancelled = false;
    const fetchAllCalendars = async () => {
      try {
        // Initialize pods
        const pods = Object.values(calendars).map((calendar) => ({
          workpodId: calendar.alias,
          isReserved: false,
          freeFor: 0,
          freeUntil: null,
          events: [],
          reservedUntil: null,
          reservedFor: 0,
        }));

        const timeMin = date.toISOString();
        const endOfDayLocal = new Date(date);
        endOfDayLocal.setHours(23, 59, 59);
        const timeMax = endOfDayLocal.toISOString();
        let hadError = false;
        const promises = pods.map((workpod, idx) =>
          getWorkpodCalendar(workpod.workpodId, timeMin, timeMax)
            .then((data) => ({ data, idx }))
            .catch((error) => {
              hadError = true;
              console.error(
                "Error fetching calendar:",
                workpod.workpodId,
                error
              );
              return null;
            })
        );
        const results = await Promise.all(promises);
        setWorkpodError(hadError);
        if (!cancelled) {
          setWorkPods(updateAllWorkPods(pods, results, date));
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setWorkpodError(true);
          setWorkPods([]);
          setLoading(false);
        }
        console.error("Error fetching all calendars:", error);
      }
    };

    setLoading(true);
    fetchAllCalendars();

    return () => {
      cancelled = true;
    };
  }, [calendars, date]);

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
    .sort((a, b) => a.reservedFor - b.reservedFor)
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

  const retrySearch = () => {
    setLoading(true);
    setTimedOut(false);
    setWorkPods([]);
    setRetryCount((prev) => prev + 1);
  };
  // Display error
  if (isError || timedOut || workpodError) {
    console.error("Error fetching workpods or timed out");
    return (
      <PageWrapper pageTitle={t("searchresults-title")}>
        <div className="error-message" role="alert">
          <p>{t("searchresults-error")}.</p>
          <ActionButton
            label={t("searchresults-retry")}
            onClick={retrySearch}
          />
        </div>
      </PageWrapper>
    );
  }
  // No date provided
  if (!date)
    return (
      <PageWrapper pageTitle={t("searchresults-title")}>
        <div>{t("searchresults-no-date")}.</div>
      </PageWrapper>
    );
  // Still loading
  if (loading)
    return (
      <PageWrapper pageTitle={t("searchresults-title")} aria-busy="true">
        <div className="loading">
          <p>{t("loading")}...</p>
          <div className="results">
            <ul className="skeleton-list">
              {[...Array(5)].map((_, i) => (
                <li key={i} className="skeleton-item">
                  <p>{t("loading")}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageWrapper>
    );
  // Display results
  return (
    <PageWrapper pageTitle={t("searchresults-title")}>
      <div className="results">
        <section aria-labelledby="available-heading">
          <h2 id="available-heading">
            {t("searchresults-available")} {format(date, "dd/MM/yyyy HH:mm")}
          </h2>
          {workPodsAvailable.length > 0 ? (
            <div className="resultsGroup">
              <ul className="available-results">{workPodsAvailable}</ul>
            </div>
          ) : (
            <p className="no-results">{t("searchresults-no-available")}.</p>
          )}
        </section>
        <section aria-labelledby="reserved-heading">
          <h2 id="reserved-heading">
            {t("searchresults-reserved")} {format(date, "dd/MM/yyyy HH:mm")}
          </h2>
          {workPodsReserved.length > 0 ? (
            <div className="resultsGroup">
              <ul className="reserved-results">{workPodsReserved}</ul>
            </div>
          ) : (
            <p className="no-results">{t("searchresults-no-reserved")}.</p>
          )}
        </section>
      </div>
    </PageWrapper>
  );
};

export default SearchResults;
