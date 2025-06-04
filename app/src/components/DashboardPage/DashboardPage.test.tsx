import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DashboardPage from "./index";
import { MemoryRouter } from "react-router";

// --- Shared mocks and spies ---
const mockNavigate = vi.fn();
let mockAuth = { isAuthenticated: () => true, user: { name: "Test User" } };

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>(
    "react-router"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    MemoryRouter: actual.MemoryRouter,
  };
});

vi.mock("@auth/useAuth", () => ({
  useAuth: () => mockAuth,
}));

vi.mock("@hooks/useReservations", () => ({
  useReservations: () => ({
    data: [
      {
        id: "1",
        calendarId: "Pod A",
        start: "2025-06-04T10:00:00Z",
        end: "2025-06-04T11:00:00Z",
      },
    ],
    isLoading: false,
    error: false,
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@components/ActionButton", () => ({
  default: ({ label }: { label: string }) => <button>{label}</button>,
}));

vi.mock("@components/PageWrapper", () => ({
  default: ({
    pageTitle,
    children,
  }: {
    pageTitle: string;
    children: React.ReactNode;
  }) => (
    <div>
      <h1>{pageTitle}</h1>
      {children}
    </div>
  ),
}));

vi.mock("./UpcomingReservations", () => ({
  default: () => <div>MockedReservations</div>,
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockAuth = {
      isAuthenticated: () => true,
      user: { name: "Test User" },
    };
  });

  it("renders user name and upcoming reservations", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("dashboard-upcoming")).toBeInTheDocument();
    expect(screen.getByText("MockedReservations")).toBeInTheDocument();
  });

  it("redirects if not authenticated", () => {
    mockAuth = {
      isAuthenticated: () => false,
      user: { name: "" },
    };

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
