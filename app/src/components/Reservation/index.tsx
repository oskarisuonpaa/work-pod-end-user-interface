import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Reservation = () => {
  return (
    <div className="page-content">
      <div className="page-title">
        <h1>C230-1</h1>
      </div>
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridDay" />
    </div>
  );
};

export default Reservation;
