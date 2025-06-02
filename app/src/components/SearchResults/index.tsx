
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
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasFetched, setHasFetched] = useState<boolean>(false);
    const { t } = useTranslation();


    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        // fetch list of workpods
        if (!date || isFetching) return;
        setDateString(date.toISOString());
        setIsFetching(true);
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
                            reservedFor: 0
                        });
                    }
                    setWorkPods(pods);
                    setHasFetched(true);
                }
            })
            .catch((error) => console.error(error));
    }, [date]);

    // fetch data for each workpod
    useEffect(() => {
        if (!date || !hasFetched || !loading) return;
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
                    setWorkPods(prevPods => updateWorkPods(prevPods, data, date, idx));
                    setLoadedCount((count) => count + 1);
                })
                .catch((error) => console.error(error));
        });
    }, [hasFetched, date]);

    useEffect(() => {
        if (loadedCount === workPods.length && workPods.length > 0) {
            setLoading(false);
        }
    }, [loadedCount, workPods.length]);

    // need to remove any reserved workpods from the list
    // we also need to sort workpods by freeFor
    // so we can show the one with most time available first
    const workPodsAvailable = workPods
        .filter((workpod) => !workpod.isReserved)
        .sort((a, b) => b.freeFor - a.freeFor)
        .map((workpod, idx) => {
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
                        </p>
                    </Link>
                </li>
            );
        })

    const workPodsReserved =
        // show currently reserved workpods
        workPods
            .filter((workpod) => workpod.isReserved)
            .sort((a, b) => b.reservedFor - a.reservedFor)
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


    // display the results
    // list of available workpods + how many hours they are available
    // TODO add useParams for date on workpod page and add date={dateToShow} to fullCalendar
    if (!date) return <div>{t("searchresults-no-date")}.</div>;
    if (loading) return <div>{t("loading")}...</div>;
    return (
        <PageWrapper pageTitle={t("searchresults-title")}>
            <p className="search-results">{t("searchresults-text1")} {format(date, "dd/MM/yyyy HH:mm")}:</p>
            <div className="results">
                <ul className="available-results">
                    {
                        workPodsAvailable
                    }
                </ul>
                <ul className="reserved-results">
                    {
                        workPodsReserved
                    }
                </ul>
            </div>
        </PageWrapper>
    );

};

export default SearchResults;
