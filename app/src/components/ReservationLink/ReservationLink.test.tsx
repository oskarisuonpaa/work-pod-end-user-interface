import { render, screen } from "@testing-library/react";
import ReservationLink from "@components/ReservationLink";
import { vi } from "vitest";

// Mock parseDate and parseTime to return simple recognizable strings
vi.mock("@utils/dateTime", () => ({
  parseDate: (date: string) => `parsed(${date})`,
  parseTime: (time: string) => `t(${time})`,
}));

// Mock Link to render as an anchor
vi.mock("react-router", () => ({
  Link: ({
    to,
    children,
    className,
  }: React.PropsWithChildren<{ to: string; className?: string }>) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

describe("ReservationLink", () => {
  it("renders correct link and content", () => {
    render(
      <ReservationLink
        id="abc123"
        podName="PodA"
        date="2025-06-04"
        startTime="10:00"
        endTime="11:00"
      />
    );

    // Link
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/reservations/PodA/abc123");
    expect(link).toHaveClass("slot");

    // Pod name
    expect(screen.getByText("PodA")).toBeInTheDocument();

    // Formatted date & time
    expect(
      screen.getByText("parsed(2025-06-04) t(10:00) - t(11:00)")
    ).toBeInTheDocument();
  });
});
