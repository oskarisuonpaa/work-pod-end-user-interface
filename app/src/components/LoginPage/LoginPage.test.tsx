import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import LoginPage from ".";

// Create a manual mock outside so it’s shared
const onLoginMock = vi.fn();

// Mocks
vi.mock("@auth/useAuth", () => ({
  useAuth: () => ({
    onLogin: onLoginMock,
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@react-oauth/google", () => {
  type GoogleLoginProps = {
    onSuccess?: (response: { credential: string }) => void;
  };
  return {
    GoogleLogin: (props: GoogleLoginProps) => (
      <button onClick={() => props.onSuccess?.({ credential: "mock-token" })}>
        Google Login
      </button>
    ),
  };
});

vi.mock("@components/PageWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    onLoginMock.mockClear();
  });

  it("renders the Google Login button", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("button", { name: /google login/i })
    ).toBeInTheDocument();
  });

  it("calls onLogin with credential on click", async () => {
    render(<LoginPage />);
    const loginButton = screen.getByRole("button", { name: /google login/i });
    await userEvent.click(loginButton);

    expect(onLoginMock).toHaveBeenCalledWith("mock-token");
  });
});
