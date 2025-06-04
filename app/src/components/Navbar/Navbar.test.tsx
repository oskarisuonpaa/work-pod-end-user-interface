import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Navbar from "@components/Navbar";

// --- Mocks ---

const mockOnLogout = vi.fn();
const mockChangeLanguage = vi.fn();
const mockSetItem = vi.spyOn(Storage.prototype, "setItem");

vi.mock("@auth/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: () => true,
    onLogout: mockOnLogout,
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "en",
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

vi.mock("react-router", () => ({
  useLocation: () => ({
    pathname: "/dashboard",
  }),
  Link: ({
    to,
    children,
    ...props
  }: React.PropsWithChildren<{ to: string }>) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard links when logged in", () => {
    render(<Navbar />);

    expect(screen.getByText("navbar-dashboard")).toBeInTheDocument();
    expect(screen.getByText("navbar-workpods")).toBeInTheDocument();
    expect(screen.getByText("navbar-reservations")).toBeInTheDocument();
    expect(screen.getByText("navbar-search")).toBeInTheDocument();
    expect(screen.getByText("navbar-logout")).toBeInTheDocument();
  });

  it("calls onLogout when logout link is clicked", () => {
    render(<Navbar />);
    const logoutLink = screen.getByText("navbar-logout");
    fireEvent.click(logoutLink);
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it("calls i18n.changeLanguage and sets localStorage on EN click", () => {
    render(<Navbar />);
    const enButton = screen.getByText("EN");
    fireEvent.click(enButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
    expect(mockSetItem).toHaveBeenCalledWith("userLanguage", "en");
  });

  it("calls i18n.changeLanguage and sets localStorage on FI click", () => {
    render(<Navbar />);
    const fiButton = screen.getByText("FI");
    fireEvent.click(fiButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith("fi");
    expect(mockSetItem).toHaveBeenCalledWith("userLanguage", "fi");
  });

  it("applies active-link class to current path", () => {
    render(<Navbar />);
    const dashboardLink = screen.getByText("navbar-dashboard");
    expect(dashboardLink).toHaveClass("active-link");
  });
});
