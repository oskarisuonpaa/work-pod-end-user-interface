// SearchResults
import { useLocation } from "react-router";

const SearchResults = () => {
    // receive data from the search page
    const location = useLocation();
    const { date } = location.state || {}; // use optional chaining to avoid errors if state is undefined
    console.log("SearchResults date:", date);
    // send data to the backend - may need converting to the right format
    // handle the response
    // display the results
    return (
        <>
        <h1>SearchResults</h1>
        <p>SearchResults: {JSON.stringify(date)}</p>
        </>
    );
} 

export default SearchResults;