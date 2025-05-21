// Search
import "./Search.css"
import DatePicker,  { registerLocale, setDefaultLocale } from "react-datepicker";
import { fi } from "date-fns/locale";
import {addDays} from "date-fns";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fi", fi);
setDefaultLocale("fi");

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
// TODO: custom css for datepicker
const Search = () => {
      const [startDate, setStartDate] = useState<Date | null>(null);
return (
<div id="searchContainer">
    <h1>Search for available workpods</h1>
    <p>You can make a reservation up to 30 days in advance.</p>
    <form>
        <label htmlFor="date">Date:</label>
        <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      includeDateIntervals={[ { start: new Date(), end: addDays(new Date(), 30) } ]}
      dateFormat="dd/MM/yyyy"
      placeholderText="Select a date."
      locale="fi"
      calendarClassName="custom-calendar"
    /><br />
    <label htmlFor="time">Time:</label>
  
        <DatePicker
        showTimeSelect 
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        showTimeSelectOnly
        dateFormat="HH:mm"
        calendarClassName="custom-time"
        />
        <br />
        <label htmlFor="duration">Duration:</label>
        <input type="number" id="duration" name="duration" min="0" max="8" /> hours<br />

        <button type="submit" id="searchButton">Search</button>
    </form>
</div>
)};

export default Search;