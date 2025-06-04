import { render, screen } from "@testing-library/react";
import PageWrapper from "@components/PageWrapper";

describe("PageWrapper", () => {
  it("renders the page title", () => {
    render(<PageWrapper pageTitle="Test Title" />);
    const heading = screen.getByRole("heading", { name: "Test Title" });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("page-title");
  });

  it("renders children inside page-content", () => {
    render(
      <PageWrapper pageTitle="With Children">
        <p>Child content</p>
      </PageWrapper>
    );
    const child = screen.getByText("Child content");
    expect(child).toBeInTheDocument();
    expect(child.parentElement).toHaveClass("page-content");
  });

  it("does not render page-content div if no children are provided", () => {
    const { container } = render(<PageWrapper pageTitle="No Children" />);
    expect(container.querySelector(".page-content")).toBeNull();
  });
});
