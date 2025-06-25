import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi, afterEach, afterAll, describe, it, expect } from "vitest";
import ReservationInfoPage from "@components/ReservationInfoPage";

// --- Mocks ---

const mockNavigate = vi.fn();
const mockDeleteReservation = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("api/reservations", () => ({
  reservationApi: {
    deleteReservation: (...args: unknown[]) => mockDeleteReservation(...args),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@components/PageWrapper", () => ({
  default: ({
    pageTitle,
    children,
  }: {
    pageTitle: string;
    children?: React.ReactNode;
  }) => (
    <div>
      <h1>{pageTitle}</h1>
      {children}
    </div>
  ),
}));

vi.mock("@components/ActionButton", () => ({
  default: ({ onClick, label }: { onClick: () => void; label: string }) => (
    <button onClick={onClick}>{label}</button>
  ),
}));

const mockReservation = {
  id: "res123",
  calendarId: "calendar123", // not used directly in InfoPage
  start: "10:00",
  end: "11:00",
  date: "2025-06-04",
  room: "Room A", // becomes the displayed/used calendarId
};

describe("ReservationInfoPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("redirects if no reservation is passed via location.state", () => {
    render(
      <MemoryRouter initialEntries={["/reservations/calendar123/res123"]}>
        <ReservationInfoPage />
      </MemoryRouter>
    );
    expect(
      screen.queryByRole("heading", { name: "reservation-info" })
    ).not.toBeInTheDocument();
  });

  it("renders reservation info from location.state", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/reservations/calendar123/res123",
            state: { reservation: mockReservation },
          },
        ]}
      >
        <ReservationInfoPage />
      </MemoryRouter>
    );

    // title
    expect(
      screen.getByRole("heading", { name: "reservation-info" })
    ).toBeInTheDocument();

    // now shows Room A (room is aliased to calendarId)
    expect(screen.getByText(/workpod.*Room A/i)).toBeInTheDocument();

    // time and date
    expect(screen.getByText(/10:00\s*-\s*11:00/)).toBeInTheDocument();
    expect(screen.getByText(/2025-06-04/)).toBeInTheDocument();
  });

  it("calls deleteReservation and redirects when cancel is confirmed", () => {
    vi.stubGlobal("confirm", () => true);
    vi.stubGlobal("alert", () => {});
    mockDeleteReservation.mockResolvedValue(undefined);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/reservations/calendar123/res123",
            state: { reservation: mockReservation },
          },
        ]}
      >
        <ReservationInfoPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "cancel-button" }));

    // now we expect the delete to be called with room ("Room A") as calendarId
    expect(mockDeleteReservation).toHaveBeenCalledWith({
      calendarId: "Room A",
      reservationId: "res123",
    });

    expect(mockNavigate).toHaveBeenCalledWith("/reservations");
  });

  it("does not call deleteReservation if user cancels", () => {
    vi.stubGlobal("confirm", () => false);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/reservations/calendar123/res123",
            state: { reservation: mockReservation },
          },
        ]}
      >
        <ReservationInfoPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "cancel-button" }));
    expect(mockDeleteReservation).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
