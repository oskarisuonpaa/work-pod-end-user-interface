import { render, screen, fireEvent } from "@testing-library/react";
import { vi, afterEach, describe, it, expect } from "vitest";
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

afterEach(() => {
  vi.clearAllMocks();
});

describe("Navbar", () => {
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
    fireEvent.click(screen.getByText("navbar-logout"));
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it("calls i18n.changeLanguage and sets localStorage on EN click", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByText("EN"));
    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
    expect(mockSetItem).toHaveBeenCalledWith("userLanguage", "en");
  });

  it("calls i18n.changeLanguage and sets localStorage on FI click", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByText("FI"));
    expect(mockChangeLanguage).toHaveBeenCalledWith("fi");
    expect(mockSetItem).toHaveBeenCalledWith("userLanguage", "fi");
  });

  it("applies active-link class to current path", () => {
    render(<Navbar />);
    expect(screen.getByText("navbar-dashboard")).toHaveClass("active-link");
  });
});
