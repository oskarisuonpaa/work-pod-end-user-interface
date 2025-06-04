import { render, screen } from "@testing-library/react";
import Workpod from "@components/Workpod";
import { MemoryRouter, Routes, Route } from "react-router";
import { describe, it, expect, vi } from "vitest";

// Properly mock hooks
vi.mock("@auth/useAuth", () => ({
  useAuth: () => ({ user: { name: "John Doe" } }),
}));

vi.mock("@hooks/useWorkpodCalendar", () => ({
  __esModule: true,
  default: () => ({ data: [] }),
}));

vi.mock("@hooks/usePostReservation", () => ({
  __esModule: true,
  default: () => ({ mutateAsync: vi.fn() }),
}));

vi.mock("@hooks/useDeleteReservation", () => ({
  __esModule: true,
  default: () => ({ mutateAsync: vi.fn() }),
}));

describe("Workpod page", () => {
  it("renders with a workpodId", () => {
    render(
      <MemoryRouter initialEntries={["/workpod/test-pod"]}>
        <Routes>
          <Route path="/workpod/:workpodId" element={<Workpod />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("test-pod")).toBeInTheDocument();
  });
});
