// SearchResults
import { useLocation } from "react-router";
import { minutesToHours, differenceInMinutes, format, isWithinInterval, setHours, setMinutes, add } from "date-fns";
import { useEffect, useState } from "react";
import "./SearchResults.css";

const SearchResults = () => {
    // receive data from the search page
    const location = useLocation();
    const { date } = location.state || {}; // use optional chaining to avoid errors if state is undefined
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
                    pods.push({ workpodId: calendars.calendars[id], isReserved: false, freeFor: 0, events: [] });
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
            const timeMax = format(date, "yyyy-MM-dd'T'23:00:00'Z'");
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

                        if (data.length === 0) {
                            console.log("No reservations found for", workpodId);
                            newPods[idx].isReserved = false;
                            // calculate freefor the rest of the work day
                            let dateEnd = date;
                            dateEnd = setHours(dateEnd, 20);
                            dateEnd = setMinutes(dateEnd, 0);
                            newPods[idx].freeFor = differenceInMinutes(dateEnd, date);
                            newPods[idx] = { ...newPods[idx], events: data };

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
                        //if isReserved is false, calculate freeFor
                        if (!isReserved) {
                            //const sortedEvents = [...data].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
                            //check for the next reservation
                            const nextReservation = data.find((event: { start: string }) => {
                                const startDate = new Date(event.start);
                                return startDate > date;
                            });

                            if (nextReservation) {
                                const startDate = new Date(nextReservation.start);
                                freeFor = differenceInMinutes(startDate, date)

                            } else {
                                // no reservations after the selected date, free for the rest of the day
                                let dateEnd = date;
                                dateEnd = setHours(dateEnd, 20);
                                dateEnd = setMinutes(dateEnd, 0);
                                freeFor = differenceInMinutes(dateEnd, date);
                            }
                        }
                        newPods[idx] = { ...newPods[idx], isReserved, freeFor, events: data };
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
    if (!date) return <div>No date selected</div>;
    if (loading) return <div>Loading...</div>;
    return (
        <div id="searchResults" className="page-content">
            <h1 className="page-title">Available workpods</h1>
            <p>Available workpods at {format(date, "dd/MM/yyyy HH:MM")}:</p>
            <div className="results">
                <ul>
                    {
                        // need to remove any reserved workpods from the list
                        // we also need to sort workpods by freeFor
                        // so we can show the one with most time available first
                        workPods
                            .filter(workpod => !workpod.isReserved)
                            .sort((a, b) => b.freeFor - a.freeFor)
                            .map((workpod, idx) => {
                                let minutes = workpod.freeFor;
                                let hours = minutesToHours(minutes);
                                let minutesLeft = minutes % 60;
                                return (
                                    <li key={idx} className="lab-arrow">
                                        <a href=""><h3>{workpod.workpodId}</h3>

                                            <p> Free for: {hours > 0 && ` ${hours} hours`}
                                                {minutesLeft > 0 && ` ${minutesLeft} minutes`}.

                                            </p></a></li>
                                );
                            })}

                </ul>
            </div>
        </div>
    );
}


export default SearchResults;