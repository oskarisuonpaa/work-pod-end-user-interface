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
    const dateString = format(date, "yyyy-MM-dd'T'HH:mm+03");
    // 2025-05-22T09:12+03
    const timeMin = dateString;
    const timeMax = format(date, "yyyy-MM-dd'T'20:00+03");
    const queryString = `/events?calendarId=C220-1&timeMin=${timeMin}&timeMax=${timeMax}`;
    console.log(queryString);
    
    // handle the response

    // display the results
    return (
        <div id="searchResults">
        <h1>SearchResults</h1>
        <p>SearchResults: {dateString}</p>
        </div>
    );
} 

export default SearchResults;