// Search
import "./Search.css"
import DatePicker,  { registerLocale, setDefaultLocale } from "react-datepicker";
import { fi } from "date-fns/locale";
import {addDays} from "date-fns";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fi", fi);
setDefaultLocale("fi");

// search is mainly needed if someone doesn't care which workpod they use
// and just wants to find an available one
// what are the "working hours" for the workpods? 8-16, 6-20?
// once search parameters are in, look through the calendars of the workpods
// to see if any are available at the selected time
// TODO: custom css for datepicker

const Search = () => {
      const [startDate, setStartDate] = useState<Date | null>(new Date());
        const handleSubmit = (event: React.FormEvent) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const duration = form.duration.value;
            const date = startDate; // contains both date and time
            if (date) {
            console.log("Selected date:", date);
            console.log("Selected duration:", duration);
            }
            // do something with the data
        }
return (
<div id="searchContainer">
    <h1>Search for available workpods</h1>
    <p>You can make a reservation up to 30 days in advance.</p>
    <form id="searchForm" onSubmit={handleSubmit}>
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
        onChange={(time) => setStartDate(time)}
        showTimeSelectOnly
        dateFormat="HH:mm"
        calendarClassName="custom-time"
        />
        <br />
        <label htmlFor="duration">Duration:</label>
        <input type="number" id="duration" name="duration" min="0" max="8"/> hours<br />

        <button type="submit" id="searchButton">Search</button>
    </form>
</div>
)};

export default Search;