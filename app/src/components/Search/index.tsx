// Search
import { addDays, getDay } from "date-fns";
import { fi } from "date-fns/locale";
import { useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import PageWrapper from "../PageWrapper";
import "react-datepicker/dist/react-datepicker.css";
import "./Search.css";
import ActionButton from "@components/ActionButton";

registerLocale("fi", fi);
setDefaultLocale("fi");

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
        date:
          startDate && startDate.getTime() > now.getTime() ? startDate : now,
      },
    });
  };


  return (
    <PageWrapper pageTitle={t("search-title")}>
      <p id="search-info">{t("search-reservation-info")}</p>
      <form id="searchForm" onSubmit={handleSubmit} className="search-form">
          <label htmlFor="date">{t("date")}:</label>

          <DatePicker
          id="date"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            includeDateIntervals={[
              { start: new Date(), end: addDays(new Date(), 30) },
            ]}
            showPopperArrow={false}
            filterDate={isWeekday}
            dateFormat="dd/MM/yyyy"
            selectsDisabledDaysInRange
            popperPlacement={"right-start"}
            autoFocus
            calendarClassName="custom-calendar"
            minDate={new Date()}
            maxDate={addDays(new Date(), 30)}
          />
          <label htmlFor="time">{t("search-label-time")}:</label>

          <DatePicker
            id="time"
            showTimeSelect
            showPopperArrow={false}
            selected={startDate}
            onChange={(time) => setStartDate(time)}
            showTimeSelectOnly
            popperPlacement={"right-start"}
            dateFormat="HH:mm"
            calendarClassName="custom-time"
          />
          <ActionButton label={t("search-button")} type="submit" className="last-row" />
      </form>
    </PageWrapper>
  );
};

export default Search;
