import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { vi, afterEach, afterAll, describe, it, expect } from "vitest";
import ReservationInfoPage from "@components/ReservationInfoPage";
import { parseDate, parseTime } from "@utils/dateTime";

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
  start: "2025-05-25T09:00:00+03:00",
  end: "2025-05-25T10:00:00+03:00",
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
        <Routes>
          <Route
            path="/reservations/:calendarId/:reservationId"
            element={<ReservationInfoPage />}
          />
        </Routes>
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
        <Routes>
          <Route
            path="/reservations/:calendarId/:reservationId"
            element={<ReservationInfoPage />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "reservation-info" })
    ).toBeInTheDocument();

    expect(screen.getByText(/workpod.*calendar123/i)).toBeInTheDocument();

    expect(
      screen.getByText(
        new RegExp(
          `${parseTime(mockReservation.start)}\\s*-\\s*${parseTime(
            mockReservation.end
          )}`
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(parseDate(mockReservation.start)))
    ).toBeInTheDocument();
  });

  it("calls deleteReservation and redirects when cancel is confirmed", async () => {
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
        <Routes>
          <Route
            path="/reservations/:calendarId/:reservationId"
            element={<ReservationInfoPage />}
          />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "cancel-button" }));

    await waitFor(() => {
      expect(mockDeleteReservation).toHaveBeenCalledWith({
        calendarId: "calendar123",
        reservationId: "res123",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/reservations");
    });
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
        <Routes>
          <Route
            path="/reservations/:calendarId/:reservationId"
            element={<ReservationInfoPage />}
          />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "cancel-button" }));
    expect(mockDeleteReservation).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
