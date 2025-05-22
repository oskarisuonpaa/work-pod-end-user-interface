// SearchResults
import { useLocation } from "react-router";
import { format } from "date-fns";
import "./SearchResults.css";

const SearchResults = () => {
    // receive data from the search page
    const location = useLocation();
    const { date } = location.state || {}; // use optional chaining to avoid errors if state is undefined
    console.log("SearchResults date:", date);
    // send data to the backend 
    // query to backend in this format:
    // /events?calendarId=C220-1&timeMin=2025-05-25T00:00:00+03:00&timeMax=2025-05-26T00:00:00+03:00
    // so timeMin is time from date, timeMax is end of day
    // convert date to the right format
    //const dateUTC = date.toUTCString();
    const dateString = date.toISOString(); //format(date, "yyyy-MM-dd'T'HH:mm+03");
    const timeMin = dateString;
    const timeMax = format(date, "yyyy-MM-dd'T'23:00:00'Z'");
    const queryString = `/events?calendarId=C238-1&timeMin=${timeMin}&timeMax=${timeMax}`;
    console.log(queryString);
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const url = backendUrl + queryString;
    console.log("URL:", url);
    // fetch data from the backend
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log("Data:", data); }
    )
    .catch(error => console.error(error));
        // handle the data
    // empty array = no reservations
    
    // display the results
    // use fullcalendar? although it's not necessary if we just want to show list
    // of available workpods + how many hours they are available
    return (
        <div id="searchResults" className="page-content">
        <h1 className="page-title">SearchResults</h1>
        <p>SearchResults: {dateString}</p>
        </div>
    );
} 

export default SearchResults;