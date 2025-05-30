// Search
import "./Search.css"
import { addDays, getDay } from "date-fns";
import { fi } from "date-fns/locale";
import { useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import PageWrapper from "../PageWrapper"
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fi", fi);
setDefaultLocale("fi");
// TODO: custom css for datepicker

const Search = () => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());

    const navigate = useNavigate();
    const { t } = useTranslation();

    const isWeekday = (date: Date) => {
        const day = getDay(date);
        return day !== 0 && day !== 6;
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const now = new Date();
        navigate("/searchresults", {
            state: {
                // if time is earlier than now, set time to now
                date: (startDate && startDate.getTime() > now.getTime() ? startDate : now),
            },
        });
    }

    return (
        <PageWrapper pageTitle={t("search-title")}>

            <p>{t("search-reservation-info")}</p>
            <form id="searchForm" onSubmit={handleSubmit}>
                <label htmlFor="date">{t("date")}: </label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    includeDateIntervals={[{ start: new Date(), end: addDays(new Date(), 30) }]}
                    filterDate={isWeekday}
                    dateFormat="dd/MM/yyyy"
                    selectsDisabledDaysInRange
                    placeholderText={t('search-placeholder-date')}
                    locale="fi"
                    calendarClassName="custom-calendar"
                /><br />
                <label htmlFor="time">{t("search-label-time")} </label>

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
        </PageWrapper>
    )
};

export default Search;