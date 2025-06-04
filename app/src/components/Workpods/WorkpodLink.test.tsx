import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import WorkpodLink from "./WorkpodLink";
import { describe, it, expect } from "vitest";

describe("WorkpodLink", () => {
  it("renders with correct pod ID, link, image, and availability class", () => {
    const podID = "Room1-A";
    const availability = "free";

    render(
      <MemoryRouter>
        <WorkpodLink podID={podID} availability={availability} />
      </MemoryRouter>
    );

    // Link to correct route
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/workpods/${podID}`);

    // Availability class
    expect(link.firstChild).toHaveClass("hexagon", availability);

    // Pod name
    expect(screen.getByText(podID)).toBeInTheDocument();

    // Image
    const img = screen.getByAltText("Peepo") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("placeholder-pepe.jpg");
  });
});
