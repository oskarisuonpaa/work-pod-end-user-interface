import { render, screen, waitFor } from "@testing-library/react";
import SearchResults from "./index";
import { vi } from "vitest";
import { MemoryRouter } from "react-router";
import * as api from "api/workpods";

// Mock useWorkpods to return fake calendars
vi.mock("@hooks/useWorkpods", () => ({
    default: () => ({
        data: [
            { alias: "Room1-A", status: "free" },
            { alias: "Room1-B", status: "busy" },
            { alias: "Room2-A", status: "free" },
        ],
        isError: false
    })
}));
vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock getWorkpodCalendar to return fake events
vi.spyOn(api, "getWorkpodCalendar").mockImplementation(async () => [
    {
        "id": "2g0b6trhf202uq87pj4r567a80",
        "title": "Joel",
        "start": "2025-05-23T11:00:00+03:00",
        "end": "2025-05-23T12:00:00+03:00",
        "description": "user_email: user@lab.fi"
    },
    {
        "id": "2g0b6trhf202uq87pj4r567are44",
        "title": "Joel",
        "start": "2025-05-23T11:00:00+03:00",
        "end": "2025-05-23T12:00:00+03:00",
        "description": "user_email: user@lab.fi"
    }
]);

describe("SearchResults page", () => {
    const now = new Date("2025-06-24T10:00:00.000+0300");

    beforeEach(() => {
        vi.clearAllMocks();
        vi.setSystemTime(now);
        
    });

    it("renders loading state initially", () => {
        render(
            <MemoryRouter initialEntries={[{ state: { date: new Date(now) } }]}>
                <SearchResults />
            </MemoryRouter>
        );
        expect(screen.getAllByText("loading").length).toBeGreaterThan(0);
    });

    it("renders error message on fetch failure", async () => {
        vi.spyOn(api, "getWorkpodCalendar").mockRejectedValue(new Error("Fetch failed"));

        render(
            <MemoryRouter initialEntries={[{ state: { date: new Date(now) } }]}>
                <SearchResults />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("searchresults-error")).toBeInTheDocument());
    });
});
