// SearchResults
import { useLocation } from "react-router";
import { differenceInHours, differenceInMinutes, format, isWithinInterval } from "date-fns";
import { useEffect, useState } from "react";
import "./SearchResults.css";

/*const dummydata = [
    {
        "id": "84ojdg6vpqp8ga0vhs6kkprq9k",
        "title": "Joel Ryynänen",
        "start": "2025-05-23T12:15:00+03:00",
        "end": "2025-05-23T13:15:00+03:00",
        "allDay": false,
        "url": "https://www.google.com/calendar/event?someurl"
    },
    {
        "id": "qk5iht3g5fdu65r5snlt9p97ec",
        "title": "Varattu",
        "start": "2025-05-23T08:00:00+03:00",
        "end": "2025-05-23T09:00:00+03:00",
        "allDay": false,
        "url": "https://www.google.com/calendar/event?someurl"
    },
]*/
// so need to compare event time to selected time
// an overlap means there is a reservation
// if no dates are after selected time, the workpod is free rest of the day
// if a date is later than seleected time, check how much time before it starts
// then display the time in hours (and minutes)
// real data will only contain responses for the selected time period
// so check if selected time is within interval of response event, 
// if it is, check how much longer it is reserved for?
// but there might also be other reservations afterwards
// so, for now let's just see if the workpod is free at selected time,
// and check if there are other reservations after that, and calculate the time
// from the selected time to the next reservation, or to the end of the day
// if there were no reservations
// then display the workpod name and how much longer it will be free
const SearchResults = () => {
    // receive data from the search page
    const location = useLocation();
    const { date } = location.state || {}; // use optional chaining to avoid errors if state is undefined
    const [workPods, setWorkPods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // need to add events to the workpods
    //let events: { id: string, title: string, start: string, end: string, allDay: boolean, url: string }[] = [];
    //let workPods: { workpodId: string, isReserved: boolean, freeFor: number, events: typeof events }[] = [];
    // fetch list of workpods from the backend, initialize them in the list
    // then fetch data for each from backend
    // update workdPods with the data

    let dateString = "";
    console.log("SearchResults date:", date);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        if (!date) return;
        // fetch data from the backend
        // fetch list of workpods
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
                setLoading(false);
            })
            .catch(error => console.error(error));
    }, [date]);


    console.log("workpods:", workPods);
    // fetch data for each workpod
    useEffect(() => {
        if (workPods.length === 0 || !date) return;
        workPods.forEach((workpod, idx) => {
            const workpodId = workpod.workpodId;
            dateString = date.toISOString(); //format(date, "yyyy-MM-dd'T'HH:mm+03");
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
                    setWorkPods((prevPods) => {
                        const newPods = [...prevPods];
                    if (data.length === 0) {
                        console.log("No reservations found for", workpodId);
                        newPods[idx].isReserved = false;
                        // calculate freefor the rest of the work day
                        newPods[idx].freeFor = 20 - date.getHours();
                        newPods[idx].events = [];
                        return newPods;
                    }
                    // check if the selected date is within the interval of the event
                    const isReserved = data.some((event: { start: string, end: string }) => {
                        const startDate = new Date(event.start);
                        const endDate = new Date(event.end);
                        return isWithinInterval(date, { start: startDate, end: endDate });
                    });
                    //if isReserved is false, calculate freeFor
                    if (!isReserved) {
                        //check for the next reservation
                        // there can be multiple reservations, so we need to look through the events
                        // and find the one with the closest start time
                        const nextReservation = data.find((event: { start: string }) => {
                            const startDate = new Date(event.start);
                            return startDate > date;
                        });
                        const minutesFree = (eventStart: any, date: Date) => {
                            return differenceInMinutes(new Date(eventStart), date);
                        }

                        if (nextReservation) {
                            const startDate = new Date(nextReservation.start);
                            /*const diff = startDate.getTime() - date.getTime();
                            const hours = Math.floor(diff / (1000 * 60 * 60));
                            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));*/
                            newPods[idx].freeFor = differenceInHours(startDate, date)
                            if (newPods[idx].freeFor === 0) {
                                newPods[idx].minutesFree = minutesFree(nextReservation.start, date);
                        }
                    }
                        else {
                            // no reservations after the selected date, free for the rest of the day
                            newPods[idx].freeFor = 20 - date.getHours();
                        }
                    } else {
                        // if isReserved is true, set freeFor to 0
                        newPods[idx].freeFor = 0;
                    }
                    newPods[idx] = {...newPods[idx], isReserved: isReserved, events: data };
                    return newPods;
                });
            })
                .catch(error => console.error(error));

        });
    },[workPods.length, date]);



    // use dummy data
    /*const data = dummydata;
    //const workpodID = "C238-1"; // remove when using real data
    data.map((event) => {
    if (isWithinInterval(date, {
        start: new Date(event.start),
        end: new Date(event.end)
    })) {
        console.log("Date is within interval");
    }
    });*/
    //=> true

    // handle the data
    // empty array = no reservations


    // display the results
    // use fullcalendar? although it's not necessary if we just want to show list
    // of available workpods + how many hours they are available
    if (!date) return <div>No date selected</div>;
    if (loading) return <div>Loading...</div>;
    return (
        <div id="searchResults" className="page-content">
            <h1 className="page-title">SearchResults</h1>
            <p>SearchResults: {dateString}</p>
            <p>Workpods:</p>
            <p>{JSON.stringify(workPods)}</p>
            <ul>

            </ul>
        </div>
    );
}


export default SearchResults;