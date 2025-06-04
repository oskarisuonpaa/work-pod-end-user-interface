import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LinkButton from "@components/LinkButton";
import { MemoryRouter } from "react-router";

describe("LinkButton", () => {
  it("renders the button with the given text", () => {
    render(
      <MemoryRouter>
        <LinkButton to="/test" label="Click Me" />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: /click me/i })).toBeInTheDocument();
  });

  it("renders with the correct href", () => {
    render(
      <MemoryRouter>
        <LinkButton to="/about" label="About" />
      </MemoryRouter>
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
  });
});
