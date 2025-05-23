// SearchResults
import { useLocation } from "react-router";
import { minutesToHours, differenceInMinutes, format, isWithinInterval, setHours, setMinutes } from "date-fns";
import { useEffect, useState } from "react";
import "./SearchResults.css";


const SearchResults = () => {
    // receive data from the search page
    const location = useLocation();
    const { date } = location.state || {}; // use optional chaining to avoid errors if state is undefined
    const [workPods, setWorkPods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateString, setDateString] = useState<string>("");


    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        // fetch list of workpods
        if (!date) return;
        setDateString(date.toISOString());
        fetch(backendUrl + "calendars", {
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


    console.log("workpods:", workPods);
    // fetch data for each workpod
    useEffect(() => {
        if (workPods.length === 0 || !date) return;
        workPods.forEach((workpod, idx) => {
            const workpodId = workpod.workpodId;
            setDateString(date.toISOString()); //format(date, "yyyy-MM-dd'T'HH:mm+03");
            const timeMin = dateString;
            const timeMax = format(date, "yyyy-MM-dd'T'23:00:00'Z'");
            const queryString = `events?calendarId=${workpodId}&timeMin=${timeMin}&timeMax=${timeMax}`;
            console.log(queryString);
            const url = backendUrl + queryString;
            console.log("URL:", url);

            fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Data for workpod id", workpod, data);
                    setWorkPods((prevPods) => {
                        const newPods = [...prevPods];

                        if (data.length === 0) {
                            console.log("No reservations found for", workpodId);
                            newPods[idx].isReserved = false;
                            // calculate freefor the rest of the work day
                            let dateEnd = setHours(date, 20);
                            dateEnd = setMinutes(dateEnd, 0);
                            newPods[idx].freeFor = differenceInMinutes(dateEnd, date);
                            newPods[idx].events = [];
                            return newPods;
                        }
                        console.log("Reservations found for", workpodId, data);
                        // check if the selected date is within the interval of the event
                        const isReserved = data.some((event: { start: string, end: string }) => {
                            const startDate = new Date(event.start);
                            const endDate = new Date(event.end);
                            return isWithinInterval(date, { start: startDate, end: endDate });
                        });
                        let freeFor = 0;
                        //if isReserved is false, calculate freeFor
                        if (!isReserved) {
                            const sortedEvents = [...data].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
                            //check for the next reservation
                            const nextReservation = sortedEvents.find((event: { start: string }) => {
                                const startDate = new Date(event.start);
                                return startDate > date;
                            });

                            if (nextReservation) {
                                const startDate = new Date(nextReservation.start);
                                freeFor = differenceInMinutes(startDate, date)

                            } else {
                                // no reservations after the selected date, free for the rest of the day
                                let dateEnd = setHours(date, 20);
                                dateEnd = setMinutes(dateEnd, 0);
                                freeFor = differenceInMinutes(dateEnd, date);
                            }
                        }
                        newPods[idx] = { ...newPods[idx], isReserved, freeFor, events: data };
                        return newPods;
                    });
                })
                .catch(error => console.error(error));

            setLoading(false);
        });
    }, [workPods.length, date]);




    // display the results
    // list of available workpods + how many hours they are available
    if (!date) return <div>No date selected</div>;
    if (loading) return <div>Loading...</div>;
    return (
        <div id="searchResults" className="page-content">
            <h1 className="page-title">SearchResults</h1>
            <p>Reservation status on {dateString}</p>
            <p>Workpods:</p>
            <ul>
                {
                    // need to remove any reserved workpods from the list
                    // we also need to sort workpods by freeFor
                    // so we can show the one with most time available first
                    workPods.sort((a, b) => {
                        return b.freeFor - a.freeFor;
                    }).filter((workpod) => !workpod.isReserved).map((workpod, idx) => {
                        let minutes = workpod.freeFor;
                        let hours = minutesToHours(minutes);
                        let minutesLeft = minutes % 60;
                        return (
                            <li key={idx}>
                                <h2>{workpod.workpodId}</h2>
                                <p>Reserved: {workpod.isReserved ? "Yes" : "No"}</p>
                                <p>Free for: {hours} hours</p>

                                <p>Minutes free: {minutesLeft}</p>

                            </li>
                        );
                    })}

            </ul>
        </div>
    );
}


export default SearchResults;