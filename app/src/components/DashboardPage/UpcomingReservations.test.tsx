import { render, screen } from "@testing-library/react";
import UpcomingReservations from "./UpcomingReservations";
import { vi } from "vitest";
import type { UserReservation } from "@types";

// Mock i18next translation function
vi.mock("i18next", () => ({
  t: (key: string) => key,
}));

// Mock ReservationLink to match new signature
vi.mock("../ReservationLink", () => ({
  __esModule: true,
  default: ({
    reservation,
  }: {
    reservation: { id: string; calendarId: string };
  }) => <div>{`${reservation.calendarId} - ${reservation.id}`}</div>,
}));

describe("UpcomingReservations", () => {
  it("renders message when no reservations exist", () => {
    render(<UpcomingReservations reservations={[]} />);
    expect(screen.getByText("dashboard-no-upcoming")).toBeInTheDocument();
  });

  it("renders sorted top 3 reservations", () => {
    const reservations: UserReservation[] = [
      {
        id: "2",
        calendarId: "Pod B",
        title: "Some title B",
        start: "2025-06-05T10:00:00Z",
        end: "2025-06-05T11:00:00Z",
      },
      {
        id: "1",
        calendarId: "Pod A",
        title: "Some title A",
        start: "2025-06-04T09:00:00Z",
        end: "2025-06-04T10:00:00Z",
      },
      {
        id: "3",
        calendarId: "Pod C",
        title: "Some title C",
        start: "2025-06-06T12:00:00Z",
        end: "2025-06-06T13:00:00Z",
      },
      {
        id: "4",
        calendarId: "Pod D",
        title: "Some title D",
        start: "2025-06-07T14:00:00Z",
        end: "2025-06-07T15:00:00Z",
      },
    ];

    render(<UpcomingReservations reservations={reservations} />);

    expect(screen.getByText("Pod A - 1")).toBeInTheDocument();
    expect(screen.getByText("Pod B - 2")).toBeInTheDocument();
    expect(screen.getByText("Pod C - 3")).toBeInTheDocument();
    expect(screen.queryByText("Pod D - 4")).not.toBeInTheDocument();
  });
});
