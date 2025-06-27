import { render, screen, fireEvent } from "@testing-library/react";
import ReserveButton from "./ReserveButton";
import { describe, it, expect, vi } from "vitest";
import type { CalendarEvent, SlotStatus } from "@types";

vi.mock("@utils/dateTime", () => ({
  parseTime: (str: string) => str,
}));

describe("ReserveButton", () => {
  it("calls onReserve when clicked", () => {
    const slot = {
      id: "1",
      title: "Test Slot",
      start: "2023-10-01T10:00:00Z",
      end: "2023-10-01T11:00:00Z",
      extendedProps: { status: "free" as SlotStatus },
    } as CalendarEvent;
    const onReserve = vi.fn();

    render(<ReserveButton slots={[slot]} onReserve={onReserve} />);
    fireEvent.click(screen.getByRole("button"));

    expect(onReserve).toHaveBeenCalledTimes(1);
  });
});
