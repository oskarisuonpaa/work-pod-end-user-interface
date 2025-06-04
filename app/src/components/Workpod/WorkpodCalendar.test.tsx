import { render } from "@testing-library/react";
import WorkpodCalendar from "./WorkpodCalendar";
import { describe, it } from "vitest";

describe("WorkpodCalendar", () => {
  it("renders without crashing", () => {
    render(
      <WorkpodCalendar events={[]} date="2025-06-04" onSlotSelect={() => {}} />
    );
  });
});
