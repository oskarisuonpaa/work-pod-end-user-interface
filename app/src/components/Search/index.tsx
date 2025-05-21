// Search
import "./Search.css"

// for search we need calendar and time picker
// search based on classroom, is it even necessary?
// reservation status for right now is visible on the workpods page
// but it could still be useful to include?
// search is mainly needed if someone doesn't care which workpod they use
// and just wants to find an available one
// how to make a timepicker?
// maybe use a library like react-time-picker or react-datetime
// for duration, include 30 mins, 1 hour etc
// is 8 hours too long?
// can time be omitted?
// what are the "working hours" for the workpods? 8-16, 6-20?
// leave it freeform so someone can reserve at night if they really want to?

const Search = () => {
return (
<div id="searchContainer">
    <h1>Search</h1>
    <form>
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" name="date" /><br />
        <label htmlFor="time">Time:</label>
        <input type="time" id="time" name="time" /><br />
        <label htmlFor="duration">Duration:</label>
        <input type="number" id="duration" name="duration" min="1" max="8" /><br />

        <button type="submit" id="searchButton">Search</button>
    </form>
</div>
)};

export default Search;