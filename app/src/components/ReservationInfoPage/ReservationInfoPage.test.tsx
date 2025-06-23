import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi, afterEach, afterAll, describe, it, expect } from "vitest";
import ReservationInfoPage from "@components/ReservationInfoPage";

// --- Mocks ---

const mockNavigate = vi.fn();
const mockGetSingleReservation = vi.fn();
const mockDeleteReservation = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>(
    "react-router"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({
      calendarId: "calendar123",
      reservationId: "res123",
    }),
    MemoryRouter: actual.MemoryRouter,
  };
});

vi.mock("api/reservations", () => ({
  reservationApi: {
    getSingleReservation: (...args: unknown[]) =>
      mockGetSingleReservation(...args),
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
  calendarId: "calendar123",
  start: "10:00",
  end: "11:00",
  date: "2025-06-04",
  room: "Room A",
};

describe("ReservationInfoPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state initially", async () => {
    mockGetSingleReservation.mockResolvedValue(mockReservation);

    render(
      <MemoryRouter>
        <ReservationInfoPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /loading/i })
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "reservation-info" })
      ).toBeInTheDocument()
    );
  });

  it("renders reservation info when fetch succeeds", async () => {
    mockGetSingleReservation.mockResolvedValue(mockReservation);

    render(
      <MemoryRouter>
        <ReservationInfoPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/workpod.*room a/i)).toBeInTheDocument();
      expect(screen.getByText(/10:00\s*-\s*11:00/)).toBeInTheDocument();
      expect(screen.getByText(/2025-06-04/)).toBeInTheDocument();
    });
  });

  it("shows error page when fetch fails", async () => {
    mockGetSingleReservation.mockRejectedValue(new Error("Fetch failed"));

    render(
      <MemoryRouter>
        <ReservationInfoPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "reservation-not-found" })
      ).toBeInTheDocument()
    );

    expect(screen.getByText("reservation-failed-load")).toBeInTheDocument();
  });

  it("calls deleteReservation and redirects when cancel is confirmed", async () => {
    mockGetSingleReservation.mockResolvedValue(mockReservation);
    mockDeleteReservation.mockResolvedValue(undefined);

    vi.stubGlobal("confirm", () => true);
    vi.stubGlobal("alert", vi.fn());

    render(
      <MemoryRouter>
        <ReservationInfoPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByRole("button", { name: "cancel-button" }));

    fireEvent.click(screen.getByRole("button", { name: "cancel-button" }));

    await waitFor(() =>
      expect(mockDeleteReservation).toHaveBeenCalledWith({
        calendarId: "calendar123",
        reservationId: "res123",
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/reservations");
  });

  it("does not call deleteReservation if user cancels", async () => {
    mockGetSingleReservation.mockResolvedValue(mockReservation);
    vi.stubGlobal("confirm", () => false);

    render(
      <MemoryRouter>
        <ReservationInfoPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByRole("button", { name: "cancel-button" }));

    fireEvent.click(screen.getByRole("button", { name: "cancel-button" }));

    expect(mockDeleteReservation).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
