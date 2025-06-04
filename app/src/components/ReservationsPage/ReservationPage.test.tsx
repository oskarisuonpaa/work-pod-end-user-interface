import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ReservationsPage from "@components/ReservationsPage";

// --- Mocks ---

const mockGetUserReservations = vi.fn();

vi.mock("@utils/backendCommunication", () => ({
  getUserReservations: (...args: unknown[]) => mockGetUserReservations(...args),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../PageWrapper", () => ({
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

vi.mock("../ReservationLink", () => ({
  default: ({ id }: { id: string }) => <div>Reservation {id}</div>,
}));

describe("ReservationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading state", () => {
    mockGetUserReservations.mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    render(<ReservationsPage />);
    expect(
      screen.getByRole("heading", { name: /loading/i })
    ).toBeInTheDocument();
  });

  it("displays empty state when there are no reservations", async () => {
    mockGetUserReservations.mockResolvedValue([]);

    render(<ReservationsPage />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "reservations-no-reservations" })
      ).toBeInTheDocument()
    );
  });

  it("renders reservations list", async () => {
    const mockData = [
      {
        id: "res1",
        calendarId: "Pod1",
        start: "2025-06-04T10:00:00Z",
        end: "2025-06-04T11:00:00Z",
      },
      {
        id: "res2",
        calendarId: "Pod2",
        start: "2025-06-05T12:00:00Z",
        end: "2025-06-05T13:00:00Z",
      },
    ];
    mockGetUserReservations.mockResolvedValue(mockData);

    render(<ReservationsPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "reservations-your" })
      ).toBeInTheDocument();
      expect(screen.getByText("Reservation res1")).toBeInTheDocument();
      expect(screen.getByText("Reservation res2")).toBeInTheDocument();
    });
  });
});
