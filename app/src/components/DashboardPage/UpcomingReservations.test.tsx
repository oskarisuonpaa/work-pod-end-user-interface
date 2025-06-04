import { render, screen } from "@testing-library/react";
import UpcomingReservations from "./UpcomingReservations";
import { vi } from "vitest";

// Mock i18next translation function
vi.mock("i18next", () => ({
  t: (key: string) => key,
}));

// Mock ReservationLink component
vi.mock("../ReservationLink", () => ({
  __esModule: true,
  default: ({ id, podName }: { id: string; podName: string }) => (
    <div>{`${podName} - ${id}`}</div>
  ),
}));

describe("UpcomingReservations", () => {
  it("renders message when no reservations exist", () => {
    render(<UpcomingReservations reservations={[]} />);
    expect(screen.getByText("dashboard-no-upcoming")).toBeInTheDocument();
  });

  it("renders sorted top 3 reservations", () => {
    const reservations = [
      {
        id: "2",
        calendarId: "Pod B",
        start: "2025-06-05T10:00:00Z",
        end: "2025-06-05T11:00:00Z",
      },
      {
        id: "1",
        calendarId: "Pod A",
        start: "2025-06-04T09:00:00Z",
        end: "2025-06-04T10:00:00Z",
      },
      {
        id: "3",
        calendarId: "Pod C",
        start: "2025-06-06T12:00:00Z",
        end: "2025-06-06T13:00:00Z",
      },
      {
        id: "4",
        calendarId: "Pod D",
        start: "2025-06-07T14:00:00Z",
        end: "2025-06-07T15:00:00Z",
      },
    ];

    render(<UpcomingReservations reservations={reservations} />);

    // Should only show 3 sorted items
    expect(screen.getByText("Pod A - 1")).toBeInTheDocument();
    expect(screen.getByText("Pod B - 2")).toBeInTheDocument();
    expect(screen.getByText("Pod C - 3")).toBeInTheDocument();
    expect(screen.queryByText("Pod D - 4")).not.toBeInTheDocument();
  });
});
