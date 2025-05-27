// Search
import "./Search.css"
import DatePicker,  { registerLocale, setDefaultLocale } from "react-datepicker";
import { fi } from "date-fns/locale";
import {addDays} from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fi", fi);
setDefaultLocale("fi");
// TODO: custom css for datepicker

const Search = () => {
    //const currentDate = new Date();
      const [startDate, setStartDate] = useState<Date | null>(new Date());
      const navigate = useNavigate();
      const { t } = useTranslation();
        const handleSubmit = (event: React.FormEvent) => {
            event.preventDefault();
            const date = startDate; // contains both date and time
            if (date) {
            console.log("Selected date:", date);
            }
            // send the data to the SearchResults page
            // navigate to the SearchResults page
            navigate("/searchresults", {
                state: {
                    date: startDate,
                },
            });
        }
return (
<div id="searchContainer" className="page-content">
    <h1 className="page-title">{t("search-title")}</h1>
    <p>{t("search-reservation-info")}</p>
    <form id="searchForm" onSubmit={handleSubmit}>
        <label htmlFor="date">{t("search-label-date")}:</label>
        <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      includeDateIntervals={[ { start: new Date(), end: addDays(new Date(), 30) } ]}
      dateFormat="dd/MM/yyyy"
      selectsDisabledDaysInRange
      placeholderText={t('search-placeholder-date')}
      locale="fi"
      calendarClassName="custom-calendar"
    /><br />
    <label htmlFor="time">{t("search-label-time")}</label>
  
        <DatePicker
        showTimeSelect 
        selected={startDate}
        onChange={(time) => setStartDate(time)}
        showTimeSelectOnly
        dateFormat="HH:mm"
        calendarClassName="custom-time"
        />
        <br />
        <button type="submit" id="searchButton">{t("search-button")}</button>
    </form>
</div>
)};

export default Search;