import { render, screen, fireEvent } from "@testing-library/react";
import ActionButton from "@components/ActionButton";
import { vi } from "vitest";

// ✅ Mock the `Link` component from react-router
vi.mock("react-router", () => ({
  Link: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

describe("ActionButton", () => {
  it("renders a link when 'to' is provided", () => {
    render(<ActionButton label="Go to Page" to="/test" />);
    const link = screen.getByRole("link", { name: /go to page/i });
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveClass("button");
  });

  it("renders a button when 'onClick' is provided", () => {
    const mockClick = vi.fn();
    render(<ActionButton label="Click Me" onClick={mockClick} />);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalled();
  });

  it("applies additional className", () => {
    render(
      <ActionButton label="Styled Button" to="/styled" className="custom" />
    );
    const link = screen.getByRole("link", { name: /styled button/i });
    expect(link).toHaveClass("button custom");
  });
});
