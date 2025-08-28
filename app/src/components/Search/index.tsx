// Search
import { addDays, getDay } from "date-fns";
import { fi, enUS } from "date-fns/locale";
import { useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import PageWrapper from "../PageWrapper";
import "react-datepicker/dist/react-datepicker.css";
import "./Search.css";
import ActionButton from "@components/ActionButton";
import useIsSmallScreen from "@hooks/useIsSmallScreen.ts";

registerLocale("fi", fi);
registerLocale("en", enUS);
setDefaultLocale("fi");

/**
 * Search component for selecting a date and time for reservations.
 * @component
 * @returns {JSX.Element}
 * @description This component allows users to select a date and time for making reservations.
 * It includes a date picker for selecting the date and a time picker for selecting the time.
 * The date picker restricts selection to weekdays and allows dates within the next 30 days.
 */
const Search = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isSmallScreen = useIsSmallScreen();

  const currentLocale = i18n.language === "fi" ? "fi" : "en";

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
        <label htmlFor="date" className="search-label">
          {t("date")}:
        </label>
        <DatePicker
          id="date"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          includeDateIntervals={[
            {
              start: new Date(new Date().setHours(0, 0, 0, 0)),
              end: addDays(new Date(new Date().setHours(0, 0, 0, 0)), 30),
            },
          ]}
          showPopperArrow={false}
          filterDate={isWeekday}
          dateFormat="dd/MM/yyyy"
          locale={currentLocale}
          selectsDisabledDaysInRange
          inline={isSmallScreen}
          popperPlacement={"right-start"}
          autoFocus
          showTimeSelect={isSmallScreen}
          timeFormat="HH:mm"
          calendarStartDay={1}
          timeIntervals={30}
          timeCaption={t("time")}
          calendarClassName="custom-calendar"
          minDate={new Date()}
          maxDate={addDays(new Date(), 30)}
        />
        <label htmlFor="time" className="search-label">
          {t("time")}:
        </label>
        {!isSmallScreen && (
          <DatePicker
            id="time"
            showTimeSelect
            showPopperArrow={false}
            selected={startDate}
            onChange={(time) => setStartDate(time)}
            showTimeSelectOnly
            inline={isSmallScreen}
            popperPlacement={"right-start"}
            timeFormat="HH:mm"
            dateFormat="HH:mm"
            timeIntervals={30}
            calendarClassName="custom-time"
            timeCaption={t("time")}
          />
        )}
        <ActionButton
          label={t("search-button")}
          type="submit"
          className="last-row"
        />
      </form>
    </PageWrapper>
  );
};

export default Search;
