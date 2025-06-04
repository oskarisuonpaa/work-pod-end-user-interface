import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import InfoPage from "@components/InfoPage";

// --- Shared mock for isAuthenticated ---
let mockIsAuthenticated = () => false;

vi.mock("@auth/useAuth.ts", () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@components/ActionButton", () => ({
  default: ({ label, to }: { label: string; to: string }) => (
    <a href={to}>{label}</a>
  ),
}));

vi.mock("../PageWrapper", () => ({
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

describe("InfoPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = () => false; // Default to unauthenticated
  });

  it("shows access text and login button when not authenticated", () => {
    render(<InfoPage />);
    expect(screen.getByText("info-access-text")).toBeInTheDocument();
    expect(screen.getByText("navbar-login")).toBeInTheDocument();
  });

  it("hides access text when authenticated", () => {
    mockIsAuthenticated = () => true;
    render(<InfoPage />);
    expect(screen.queryByText("info-access-text")).not.toBeInTheDocument();
  });

  it("always shows informational paragraphs", () => {
    render(<InfoPage />);
    expect(screen.getByText("info-text1")).toBeInTheDocument();
    expect(screen.getByText("info-text2")).toBeInTheDocument();
  });

  it("renders correct page title", () => {
    render(<InfoPage />);
    expect(
      screen.getByRole("heading", { name: /info - info-title/i })
    ).toBeInTheDocument();
  });
});
