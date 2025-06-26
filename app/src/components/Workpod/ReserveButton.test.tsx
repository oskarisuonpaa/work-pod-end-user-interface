import { render, screen, fireEvent } from "@testing-library/react";
import ReserveButton from "./ReserveButton";
import { describe, it, expect, vi } from "vitest";

vi.mock("@utils/dateTime", () => ({
  parseTime: (str: string) => str,
}));

describe("ReserveButton", () => {
  it("calls onReserve when clicked", () => {
    const slot = { start: "2024-01-01T10:00", end: "2024-01-01T11:00" };
    const onReserve = vi.fn();

    render(<ReserveButton slots={[slot]} onReserve={onReserve} />);
    fireEvent.click(screen.getByRole("button"));

    expect(onReserve).toHaveBeenCalledTimes(1);
  });
});
