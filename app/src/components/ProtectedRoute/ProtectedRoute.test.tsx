import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import ProtectedRoute from "@components/ProtectedRoute";

// Toggleable auth mock
let mockIsAuthenticated = () => true;

vi.mock("@auth/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
  }),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>(
    "react-router"
  );
  return {
    ...actual,
  };
});

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = () => true;
  });

  it("renders children when authenticated", () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Secret Content</p>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("Secret Content")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    mockIsAuthenticated = () => false;

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Should Not Render</p>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Should Not Render")).not.toBeInTheDocument();
  });
});
