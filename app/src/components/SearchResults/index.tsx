// SearchResults
import { useLocation, Link } from "react-router";
import { differenceInMinutes, format, isWithinInterval, setHours, setMinutes, add } from "date-fns";
import { useEffect, useState } from "react";
import "./SearchResults.css";

const SearchResults = () => {
    // receive data from the search page
    const location = useLocation();
    const { date } = location.state || {};
    const [workPods, setWorkPods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateString, setDateString] = useState<string>("");
    const [loadedCount, setLoadedCount] = useState(0);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        // fetch list of workpods
        if (!date || !loading) return;
        if (workPods.length > 0) return;
        setDateString(date.toISOString());
        fetch(backendUrl + "/calendars", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            }
        })
            .then(response => response.json())
            .then(calendars => {
                const pods = [];
                console.log("Calendars:", calendars);
                // initialize workpods
                for (const id in calendars.calendars) {
                    pods.push({ workpodId: calendars.calendars[id], isReserved: false, freeFor: 0, freeUntil: null, events: [], reservedUntil: null });
                }
                setWorkPods(pods);

            })
            .catch(error => console.error(error));
    }, [date]);


    // fetch data for each workpod
    useEffect(() => {
        if (workPods.length === 0 || !date || !loading) return;
        setLoadedCount(0);
        const dateMinute = add(date, { minutes: 1 }); // interval check returns true if reservation ends at 15:00 and date is 15:00
        workPods.forEach((workpod, idx) => {
            const workpodId = workpod.workpodId;
            setDateString(date.toISOString()); //format(date, "yyyy-MM-dd'T'HH:mm+03");
            const timeMin = dateString;
            const timeMax = format(date, "yyyy-MM-dd'T'23:59:59'Z'");
            const queryString = `/events?calendarId=${workpodId}&timeMin=${timeMin}&timeMax=${timeMax}`;

            const url = backendUrl + queryString;

            fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setWorkPods((prevPods) => {
                        const newPods = [...prevPods];
                        let freeUntil = null;

                        if (data.length === 0) {
                            console.log("No reservations found for", workpodId);
                            newPods[idx].isReserved = false;
                            // calculate freefor the rest of the work day
                            let dateEnd = date;
                            dateEnd = setHours(dateEnd, 23);
                            dateEnd = setMinutes(dateEnd, 59);
                            newPods[idx].freeFor = differenceInMinutes(dateEnd, date);
                            freeUntil = dateEnd;
                            newPods[idx] = { ...newPods[idx], freeUntil, events: data };

                            return newPods;
                        }
                        console.log("Reservations found for", workpodId, data);
                        // check if the selected date is within the interval of the event
                        const isReserved = data.some((event: { start: string, end: string }) => {
                            const startDate = new Date(event.start);
                            const endDate = new Date(event.end);
                            return isWithinInterval(dateMinute, { start: startDate, end: endDate });
                        });
                        let freeFor = 0;
                        const sortedEvents = [...data].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
                        //if isReserved is false, calculate freeFor
                        if (!isReserved) {
                            //check for the next reservation
                            const nextReservation = sortedEvents.find((event: { start: string }) => {
                                const startDate = new Date(event.start);
                                return startDate > date;
                            });

                            if (nextReservation) {
                                const startDate = new Date(nextReservation.start);
                                freeFor = differenceInMinutes(startDate, date)
                                freeUntil = startDate;

                            } else {
                                // no reservations after the selected date, free for the rest of the day
                                let dateEnd = date;
                                dateEnd = setHours(dateEnd, 23);
                                dateEnd = setMinutes(dateEnd, 59);
                                freeFor = differenceInMinutes(dateEnd, date);
                                freeUntil = dateEnd;
                            }
                        } else { //isReserved
                            // need to use sortedEvents, check the end time of the first event
                            // then check whether the next event starts right away
                            // if yes, then need to check when that event ends... etc
                            const firstEvent = sortedEvents[0];
                            let endDate = new Date(firstEvent.end);
                            let reservedUntil = new Date(firstEvent.end);
                            if (endDate > date) {
                                // if sortedEvents(next) ?
                                if (sortedEvents.length > 1) {
                                    for (let i = 1; i < sortedEvents.length; i++) {
                                        const nextEvent = sortedEvents[i];
                                        const nextStartDate = new Date(nextEvent.start);
                                        if (nextStartDate > endDate) {
                                            // found the next event that starts after the current event ends
                                            reservedUntil = endDate;
                                            break;
                                        }
                                        endDate = new Date(nextEvent.end);
                                    }
                                }
                            }
                            newPods[idx].reservedUntil = reservedUntil;
                        }


                        newPods[idx] = { ...newPods[idx], isReserved, freeFor, freeUntil, events: data };
                        return newPods;
                    });
                    console.log("Data for workpod id", workpod, data);
                    setLoadedCount(count => count + 1);

                })
                .catch(error => console.error(error));

        });
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
        <div id="searchResults" className="page-content">
            <h1 className="page-title">Available workpods</h1>
            <p>Available workpods at {format(date, "dd/MM/yyyy HH:mm")}:</p>
            <div className="results">
                <ul className="available-results">
                    {
                        // need to remove any reserved workpods from the list
                        // we also need to sort workpods by freeFor
                        // so we can show the one with most time available first
                        workPods
                            .filter(workpod => !workpod.isReserved)
                            .sort((a, b) => b.freeFor - a.freeFor)
                            .map((workpod, idx) => {
                                /*let minutes = workpod.freeFor;
                                let hours = minutesToHours(minutes);
                                let minutesLeft = minutes % 60;*/
                                return (
                                    <li key={idx} className="lab-arrow">
                                        <Link to={`/workpods/${workpod.workpodId}/${format(date, "yyyy-MM-dd")}`}><p className="workpod-title">{workpod.workpodId}</p>
                                            <p className="workpod-time">
                                                Free until {format(workpod.freeUntil, "HH:mm")}.
                                                {/*  Free for: {hours > 0 && ` ${hours} hours`}
                                                {minutesLeft > 0 && ` ${minutesLeft} minutes`}.*/}


                                            </p>
                                        </Link>
                                    </li>
                                );
                            })}

                </ul>
                <ul className="reserved-results">
                    {
                        // show currently reserved workpods
                        // we also need to sort workpods by reservedUntil
                        // so we can show the one that will be available first
                        workPods
                            .filter(workpod => workpod.isReserved)
                            //.sort((a, b) => b.freeFor - a.freeFor)
                            .map((workpod, idx) => {
                                return (
                                    <li key={idx} className="lab-arrow">
                                        <Link to={`/workpods/${workpod.workpodId}/${format(date, "yyyy-MM-dd")}`}><p className="workpod-title">{workpod.workpodId}</p>

                                            <p className="workpod-time"> Reserved until {format(workpod.reservedUntil, "HH:mm")}.

                                            </p>
                                        </Link>
                                    </li>
                                );
                            })}

                </ul>
            </div>
        </div>
    );
}


export default SearchResults;