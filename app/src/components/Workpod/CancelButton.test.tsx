import { render, screen, fireEvent } from "@testing-library/react";
import CancelButton from "./CancelButton";
import { describe, it, expect, vi } from "vitest";
import type { CalendarEvent, SlotStatus } from "@types";

vi.mock("@utils/dateTime", () => ({
  parseTime: (str: string) => str,
}));

describe("CancelButton", () => {
  it("calls onCancel when clicked", () => {
    const slot = {
      id: "1",
      title: "Test Slot",
      start: "2023-10-01T10:00:00Z",
      end: "2023-10-01T11:00:00Z",
      extendedProps: { status: "free" as SlotStatus },
    } as CalendarEvent;
    const onCancel = vi.fn();

    render(<CancelButton slots={[slot]} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("button"));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
