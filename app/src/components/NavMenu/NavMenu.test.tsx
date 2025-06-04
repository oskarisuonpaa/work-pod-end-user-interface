import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import NavMenu from "@components/NavMenu";

// Shared mocks
let mockIsAuthenticated = () => true;
const mockOnLogout = vi.fn();
const mockChangeLanguage = vi.fn();
const mockSetItem = vi.spyOn(Storage.prototype, "setItem");

// Mock router
vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>(
    "react-router"
  );
  return {
    ...actual,
    useLocation: () => ({ pathname: "/dashboard" }),
    Link: ({
      to,
      children,
      onClick,
    }: React.PropsWithChildren<{
      to: string;
      onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    }>) => (
      <a href={to} onClick={onClick}>
        {children}
      </a>
    ),
  };
});

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "en",
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

// Mock auth
vi.mock("@auth/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    onLogout: mockOnLogout,
  }),
}));

describe("NavMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = () => true;
  });

  it("opens and closes the mobile menu", () => {
    render(<NavMenu />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByText("navbar-dashboard")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/close menu/i));
    expect(screen.queryByText("navbar-dashboard")).not.toBeInTheDocument();
  });

  it("renders correct links when logged in", () => {
    render(<NavMenu />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.getByText("navbar-dashboard")).toBeInTheDocument();
    expect(screen.getByText("navbar-workpods")).toBeInTheDocument();
    expect(screen.getByText("navbar-reservations")).toBeInTheDocument();
    expect(screen.getByText("navbar-search")).toBeInTheDocument();
    expect(screen.getByText("navbar-logout")).toBeInTheDocument();
    expect(screen.getByText("Info")).toBeInTheDocument();
  });

  it("renders login link when not authenticated", () => {
    mockIsAuthenticated = () => false;
    render(<NavMenu />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.getByText("navbar-login")).toBeInTheDocument();
    expect(screen.queryByText("navbar-logout")).not.toBeInTheDocument();
  });

  it("calls onLogout and closes menu when logout is clicked", () => {
    render(<NavMenu />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

    fireEvent.click(screen.getByText("navbar-logout"));
    expect(mockOnLogout).toHaveBeenCalled();
    expect(screen.queryByText("navbar-dashboard")).not.toBeInTheDocument(); // menu closed
  });

  it("changes language and sets localStorage", () => {
    render(<NavMenu />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

    fireEvent.click(screen.getByText("FI"));
    expect(mockChangeLanguage).toHaveBeenCalledWith("fi");
    expect(mockSetItem).toHaveBeenCalledWith("userLanguage", "fi");

    fireEvent.click(screen.getByText("EN"));
    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
    expect(mockSetItem).toHaveBeenCalledWith("userLanguage", "en");
  });
});
