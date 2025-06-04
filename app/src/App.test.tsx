import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import App from "./App";

// --- Mocks ---
vi.mock("@components/Navbar", () => ({
  default: () => <div>MockNavbar</div>,
}));
vi.mock("@components/NavMenu", () => ({
  default: () => <div>MockNavMenu</div>,
}));
vi.mock("@components/PageWrapper", () => ({
  default: ({ pageTitle }: { pageTitle: string }) => <div>{pageTitle}</div>,
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
vi.mock("@components/ProtectedRoute", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Page mocks
vi.mock("@components/DashboardPage", () => ({
  default: () => <div>DashboardPage</div>,
}));
vi.mock("@components/InfoPage", () => ({
  default: () => <div>InfoPage</div>,
}));
vi.mock("@components/LoginPage", () => ({
  default: () => <div>LoginPage</div>,
}));
vi.mock("@components/Workpods", () => ({
  default: () => <div>WorkpodsPage</div>,
}));
vi.mock("@components/Workpod", () => ({
  default: () => <div>WorkpodPage</div>,
}));
vi.mock("@components/Search", () => ({
  default: () => <div>SearchPage</div>,
}));
vi.mock("@components/SearchResults", () => ({
  default: () => <div>SearchResultsPage</div>,
}));
vi.mock("@components/ReservationsPage", () => ({
  default: () => <div>ReservationsPage</div>,
}));
vi.mock("@components/ReservationInfoPage", () => ({
  default: () => <div>ReservationPage</div>,
}));

describe("App Routing", () => {
  it("redirects from / to /dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("DashboardPage")).toBeInTheDocument();
  });

  it("renders login page at /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("LoginPage")).toBeInTheDocument();
  });

  it("renders not found for unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/some/unknown/route"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/nothing-here/i)).toBeInTheDocument();
  });

  it("renders WorkpodsPage at /workpods", () => {
    render(
      <MemoryRouter initialEntries={["/workpods"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("WorkpodsPage")).toBeInTheDocument();
  });

  it("renders InfoPage at /info", () => {
    render(
      <MemoryRouter initialEntries={["/info"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("InfoPage")).toBeInTheDocument();
  });
});
