
import {
    format,
} from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router";
import updateWorkPods from "./updateWorkPods.ts";
import type { WorkPod } from "@auth/types.ts"
import PageWrapper from "../PageWrapper"
import "./SearchResults.css";



const SearchResults = () => {
    const location = useLocation();
    const { date } = location.state || {};
    const [workPods, setWorkPods] = useState<WorkPod[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateString, setDateString] = useState<string>("");
    const [loadedCount, setLoadedCount] = useState(0);
    const { t } = useTranslation();


    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        // fetch list of workpods
        if (!date || !loading) return;
        if (workPods.length > 0) return;
        setDateString(date.toISOString());
        fetch(backendUrl + "/calendars", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
            .then((response) => response.json())
            .then((calendars) => {
                console.log("Calendars:", calendars);
                if (!calendars.error) {
                    const pods = [];
                    // initialize workpods
                    for (const id in calendars.calendars) {
                        pods.push({
                            workpodId: calendars.calendars[id],
                            isReserved: false,
                            freeFor: 0,
                            freeUntil: null,
                            events: [],
                            reservedUntil: null,
                        });
                    }
                    setWorkPods(pods);
                }
            })
            .catch((error) => console.error(error));
            // the linter is overzealous in adding dependencies;
            // this useEffect only requires the date variable, and it's only intended to be run once, to fetch the initial list of workpods
            // will rework it later to remove checks for workPods.length and loading
            // (which are only in place to prevent multiple fetches, so calling this function when their state changes is counterproductive)
            // backendUrl is an environment variable; it isn't going to change
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);

    // fetch data for each workpod
    useEffect(() => {
        if (workPods.length === 0 || !date || !loading) return;
        setLoadedCount(0);
        workPods.forEach((workpod, idx) => {
            const workpodId = workpod.workpodId;
            setDateString(date.toISOString()); //format(date, "yyyy-MM-dd'T'HH:mm+03");
            const timeMin = dateString;
            const timeMax = format(date, "yyyy-MM-dd'T'23:59:59'Z'");
            const queryString = `/events?calendarId=${workpodId}&timeMin=${timeMin}&timeMax=${timeMax}`;

            const url = backendUrl + queryString;

            fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setWorkPods(prevPods => updateWorkPods(prevPods, data, date, idx, workpodId));
                    //setWorkPods((prevPods) => {
                    
                    console.log("Data for workpod id", workpod, data);
                    setLoadedCount((count) => count + 1);
                })
                .catch((error) => console.error(error));
        });
        // will rework this useEffect later, but including more variables will make it not work correctly
        // whatever the linter is saying
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workPods.length, date]);

    useEffect(() => {
        if (loadedCount === workPods.length && workPods.length > 0) {
            setLoading(false);
        }
    }, [loadedCount, workPods.length]);

    // display the results
    // list of available workpods + how many hours they are available
    // TODO add useParams for date on workpod page and add date={dateToShow} to fullCalendar
    if (!date) return <div>No date selected</div>;
    if (loading) return <div>Loading...</div>;
    return (
        <PageWrapper pageTitle={t("searchresults-title")}>
            <p className="search-results">{t("searchresults-text1")} {format(date, "dd/MM/yyyy HH:mm")}:</p>
            <div className="results">
                <ul className="available-results">
                    {
                        // need to remove any reserved workpods from the list
                        // we also need to sort workpods by freeFor
                        // so we can show the one with most time available first
                        workPods
                            .filter((workpod) => !workpod.isReserved)
                            .sort((a, b) => b.freeFor - a.freeFor)
                            .map((workpod, idx) => {
                                /*let minutes = workpod.freeFor;
                                                let hours = minutesToHours(minutes);
                                                let minutesLeft = minutes % 60;*/
                                const freeUntil = workpod.freeUntil ? format(workpod.freeUntil, "HH:mm") : "N/A";
                                return (
                                    <li key={idx} className="lab-arrow">
                                        <Link
                                            to={`/workpods/${workpod.workpodId}/${format(
                                                date,
                                                "yyyy-MM-dd"
                                            )}`}
                                        >
                                            <p className="workpod-title">{workpod.workpodId}</p>
                                            <p className="workpod-time">
                                                {t("searchresults-freeuntil", { time: freeUntil })}
                                                .
                                                {/*  Free for: {hours > 0 && ` ${hours} hours`}
                                                {minutesLeft > 0 && ` ${minutesLeft} minutes`}.*/}
                                            </p>
                                        </Link>
                                    </li>
                                );
                            })
                    }
                </ul>
                <ul className="reserved-results">
                    {
                        // show currently reserved workpods
                        // we also need to sort workpods by reservedUntil
                        // so we can show the one that will be available first
                        workPods
                            .filter((workpod) => workpod.isReserved)
                            //.sort((a, b) => b.freeFor - a.freeFor)
                            .map((workpod, idx) => {
                                const reservedUntil = workpod.reservedUntil ? format(workpod.reservedUntil, "HH:mm") : "N/A";
                                return (
                                    <li key={idx} className="lab-arrow">
                                        <Link
                                            to={`/workpods/${workpod.workpodId}/${format(
                                                date,
                                                "yyyy-MM-dd"
                                            )}`}
                                        >
                                            <p className="workpod-title">{workpod.workpodId}</p>

                                            <p className="workpod-time">
                                                {t("searchresults-reserveduntil", { time: reservedUntil })}
                                                .
                                            </p>
                                        </Link>
                                    </li>
                                );
                            })
                    }
                </ul>
            </div>
        </PageWrapper>
    );

};

export default SearchResults;
