import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Search from "./index";
import { MemoryRouter } from "react-router";
import { addDays } from "date-fns";
import userEvent from "@testing-library/user-event";

// Mocks
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
    const actual = await vi.importActual<typeof import("react-router")>("react-router");
    return { ...actual, useNavigate: () => mockNavigate, MemoryRouter: actual.MemoryRouter };
});
vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock("@components/ActionButton", () => ({
    default: ({ label }: { label: string }) => <button>{label}</button>,
}));
vi.mock("@components/PageWrapper", () => ({
    default: ({ pageTitle, children }: { pageTitle: string; children: React.ReactNode }) => (
        <div>
            <h1>{pageTitle}</h1>
            {children}
        </div>
    ),
}));
vi.mock("@hooks/useIsSmallScreen", () => ({
    __esModule: true,
    default: () => false, // Change to true to test small screen layout
}));

describe("Search page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();
    });

    it("renders all form fields and button", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );
        expect(screen.getByLabelText("date:")).toBeInTheDocument();
        expect(screen.getByLabelText("time:")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "search-button" })).toBeInTheDocument();
    });

    it("submits the form and navigates", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByRole("button", { name: "search-button" }));
        expect(mockNavigate).toHaveBeenCalledWith("/searchresults", expect.any(Object));
    });

    // Add more tests as needed:
    // - Date/time boundaries
    // - Small screen layout (mock useIsSmallScreen to true)
});

describe("Search page date picker restrictions", () => {
    const now = new Date("2025-06-24T10:00:00.000+0300");
    beforeEach(() => {
        vi.setSystemTime(now);
        vi.clearAllMocks();
        mockNavigate.mockClear();
    });

    it("does not allow selecting a past date", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );
        // Find yesterday's date
        const yesterday = addDays(new Date(now), -1).getDate();
        const className = `react-datepicker__day--${String(yesterday).padStart(3, "0")}`;
        const pastDay = screen.getAllByRole("option").find(
            (el) => el.className.includes(className)
        );
        expect(pastDay).toBeDefined();
        expect(pastDay).toHaveAttribute("aria-disabled", "true");
    });

    it("does not allow selecting a weekend", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );
        // Find the next Saturday
        const today = new Date(now);
        const nextSaturday = new Date(today);
        nextSaturday.setDate(today.getDate() + ((6 - today.getDay()) % 7));
        const saturdayDate = nextSaturday.getDate();
        const className = `react-datepicker__day--${String(saturdayDate).padStart(3, "0")}`;
        const saturdayButton = screen.getAllByRole("option").find(
            (el) => el.className.includes(className)
        );
        expect(saturdayButton).toBeDefined();
        expect(saturdayButton).toHaveAttribute("aria-disabled", "true");
    });

    it("allows selecting a future weekday", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );
        // Find the next weekday (Mon-Fri)
        const today = new Date(now);
        const nextWeekday = new Date(today);
        do {
            nextWeekday.setDate(nextWeekday.getDate() + 1);
        } while (nextWeekday.getDay() === 0 || nextWeekday.getDay() === 6);
        const className = `react-datepicker__day--${String(nextWeekday.getDate()).padStart(3, "0")}`;
        const weekdayButton = screen.getAllByRole("option").find(
            (el) =>
                el.className.includes(className) &&
                el.getAttribute("aria-disabled") === "false"
        );
        expect(weekdayButton).toBeDefined();
        expect(weekdayButton).not.toHaveAttribute("aria-disabled", "true");
        await fireEvent.click(weekdayButton!);
        // Optionally, assert that the input or state has changed
        await userEvent.click(screen.getByRole("button", { name: "search-button" }));
        const navArg = mockNavigate.mock.calls[0][1].state.date;
        expect(new Date(navArg).getTime()).toBe(nextWeekday.getTime());
    });

    it("sets time to selected time if it's in the future", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Simulate picking a future time (e.g., 15:00)
        const futureDate = new Date(now);
        futureDate.setHours(futureDate.getHours() + 5); // Set to 5 hours in the future

        await userEvent.click(screen.getByRole("textbox", { name: "time:" }));
        const timeOption = screen.getByText(`${futureDate.getHours().toString().padStart(2, "0")}:00`);

        await userEvent.click(timeOption);

        await fireEvent.click(screen.getByRole("button", { name: "search-button" }));

        // Check that navigate was called with the selected future time
        const navArg = mockNavigate.mock.calls[0][1].state.date;
        expect(new Date(navArg).getTime()).toBe(futureDate.getTime());
    });


    it("sets time to now if selected time is in the past", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Simulate picking a past time (e.g., 8:00)
        const pastDate = new Date(now);
        pastDate.setHours(pastDate.getHours() - 4); // Set to 4 hours in the past
        await userEvent.click(screen.getByRole("textbox", { name: "time:" }));

        // Find and click the time option for 12:00
        const timeOption = screen.getByText(`${pastDate.getHours().toString().padStart(2, "0")}:00`);
        await userEvent.click(timeOption);

        await fireEvent.click(screen.getByRole("button", { name: "search-button" }));

        // Check that navigate was called with now, not the past time
        const navArg = mockNavigate.mock.calls[0][1].state.date;
        expect(new Date(navArg).getTime()).toBe(now.getTime());
    });
});

