import React from "react";
import { render, screen } from "@testing-library/react";
import Workpods from "@components/Workpods";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useWorkpods } from "@hooks/useWorkpods";
vi.mock("@hooks/useWorkpods");

// Mock useTranslation to return keys
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock PageWrapper to render children directly
vi.mock("../PageWrapper", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock WorkpodLink to simplify rendering
vi.mock("./WorkpodLink", () => ({
  __esModule: true,
  default: ({
    podID,
    availability,
  }: {
    podID: string;
    availability: string;
  }) => <div>{`${podID} - ${availability}`}</div>,
}));

describe("Workpods component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("renders grouped workpods by room", () => {
    (useWorkpods as unknown as jest.Mock).mockReturnValue({
      data: [
        { alias: "Room1-A", status: "free" },
        { alias: "Room1-B", status: "occupied" },
        { alias: "Room2-A", status: "free" },
      ],
    } as ReturnType<typeof useWorkpods>);

    render(<Workpods />);

    // Check room headings
    expect(screen.getAllByText("Room1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Room2").length).toBeGreaterThan(0);

    // Check individual pods
    expect(screen.getByText("Room1-A - free")).toBeInTheDocument();
    expect(screen.getByText("Room1-B - occupied")).toBeInTheDocument();
    expect(screen.getByText("Room2-A - free")).toBeInTheDocument();
  });

  it("renders nothing when there are no workpods", () => {
    const emptyQueryResult = {
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      isFetched: true,
      refetch: vi.fn(),
      status: "success",
      failureCount: 0,
      isRefetching: false,
      isStale: false,
      isPaused: false,
      fetchStatus: "idle",
      isPending: false,
      isPlaceholderData: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      remove: vi.fn(),
    };
    vi.mocked(useWorkpods).mockReturnValue(
      emptyQueryResult as unknown as ReturnType<typeof useWorkpods>
    );

    expect(screen.queryByText(/Room/i)).not.toBeInTheDocument();
  });
});
