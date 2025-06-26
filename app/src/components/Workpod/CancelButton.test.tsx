import { render, screen, fireEvent } from "@testing-library/react";
import CancelButton from "./CancelButton";
import { describe, it, expect, vi } from "vitest";

vi.mock("@utils/dateTime", () => ({
  parseTime: (str: string) => str,
}));

describe("CancelButton", () => {
  it("calls onCancel when clicked", () => {
    const slot = { start: "2024-01-01T10:00", end: "2024-01-01T11:00" };
    const onCancel = vi.fn();

    render(<CancelButton slots={[slot]} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("button"));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
