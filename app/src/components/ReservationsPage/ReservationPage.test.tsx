import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ReservationsPage from "@components/ReservationsPage";
import type { UserReservation } from "@types";

// --- Mocks ---

const mockGetUserReservations = vi.fn();

vi.mock("api/reservations", () => ({
  reservationApi: {
    getUserReservations: (...args: unknown[]) =>
      mockGetUserReservations(...args),
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
    <main>
      <h1>{pageTitle}</h1>
      {children}
    </main>
  ),
}));

vi.mock("@components/ReservationLink", () => ({
  default: ({ id }: { id: string }) => <div>Reservation {id}</div>,
}));

describe("ReservationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading state", () => {
    mockGetUserReservations.mockImplementation(
      () => new Promise(() => {}) // Simulates pending promise
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
        screen.getByRole("heading", { name: /reservations-no-reservations/i })
      ).toBeInTheDocument()
    );
  });

  it("renders reservation list when reservations exist", async () => {
    const mockData: UserReservation[] = [
      {
        id: "res1",
        calendarId: "Pod1",
        title: "Test 1",
        start: "2025-06-04T10:00:00Z",
        end: "2025-06-04T11:00:00Z",
        description: "test1@example.com",
      },
      {
        id: "res2",
        calendarId: "Pod2",
        title: "Test 2",
        start: "2025-06-05T12:00:00Z",
        end: "2025-06-05T13:00:00Z",
        description: "test2@example.com",
      },
    ];

    mockGetUserReservations.mockResolvedValue(mockData);

    render(<ReservationsPage />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /reservations-your/i })
      ).toBeInTheDocument()
    );

    expect(screen.getByText("Reservation res1")).toBeInTheDocument();
    expect(screen.getByText("Reservation res2")).toBeInTheDocument();
  });
});
