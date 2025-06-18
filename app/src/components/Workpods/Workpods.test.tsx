import React from "react";
import { render, screen } from "@testing-library/react";
import Workpods from "@components/Workpods";
import { describe, it, expect, vi, afterEach } from "vitest";
import useWorkpods from "@hooks/useWorkpods";
import type { UseQueryResult } from "@tanstack/react-query";

vi.mock("@hooks/useWorkpods");

// Helper to return a fully mocked React Query result
const mockQueryResult = <T,>(data: T): UseQueryResult<T, Error> => ({
  data,
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
  isPlaceholderData: false,
  dataUpdatedAt: Date.now(),
  errorUpdatedAt: 0,
  isLoadingError: false,
  isRefetchError: false,
  failureReason: null,
  errorUpdateCount: 0,
  isPending: false,
  isFetchedAfterMount: true,
  isInitialLoading: false,
  promise: Promise.resolve(data),
});

// Mock i18n translation
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
  default: ({ alias, status }: { alias: string; status: string }) => (
    <div>{`${alias} - ${status}`}</div>
  ),
}));

describe("Workpods component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders grouped workpods by room", () => {
    vi.mocked(useWorkpods).mockReturnValue(
      mockQueryResult([
        { alias: "Room1-A", status: "free" },
        { alias: "Room1-B", status: "busy" },
        { alias: "Room2-A", status: "free" },
      ])
    );

    render(<Workpods />);

    // Check room headings
    expect(screen.getAllByText("Room1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Room2").length).toBeGreaterThan(0);

    // Check individual pods
    expect(screen.getByText("Room1-A - free")).toBeInTheDocument();
    expect(screen.getByText("Room1-B - busy")).toBeInTheDocument();
    expect(screen.getByText("Room2-A - free")).toBeInTheDocument();
  });

  it("renders nothing when there are no workpods", () => {
    vi.mocked(useWorkpods).mockReturnValue(mockQueryResult([]));

    render(<Workpods />);
    expect(screen.queryByText(/Room/i)).not.toBeInTheDocument();
  });
});
