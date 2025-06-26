import { render, screen, waitFor } from "@testing-library/react";
import SearchResults from "./index";
import { vi, expect } from "vitest";
import { MemoryRouter } from "react-router";
import * as api from "api/workpods";
import { format } from "date-fns";
import useWorkpods from "@hooks/useWorkpods";

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



describe("SearchResults page", () => {
    const now = new Date("2025-06-24T10:00:00.000+0300");

    beforeEach(() => {
        vi.clearAllMocks();
        vi.setSystemTime(now);
    });

    it("renders loading state initially", () => {
        // should show loading state while fetching data
        render(
            <MemoryRouter initialEntries={[{ state: { date: new Date(now) } }]}>
                <SearchResults />
            </MemoryRouter>
        );
        expect(screen.getAllByText("loading").length).toBeGreaterThan(0);
    });

    it("renders error message on fetch failure", async () => {
        // simulate getting an error when fetching workpod events
        vi.spyOn(api, "getWorkpodCalendar").mockImplementation(() => Promise.resolve([]));
        vi.spyOn(api, "getWorkpodCalendar").mockRejectedValueOnce(new Error("Fetch failed"));

        render(
            <MemoryRouter initialEntries={[{ state: { date: new Date(now) } }]}>
                <SearchResults />
            </MemoryRouter>
        );
        await waitFor(() => expect(screen.getByText("searchresults-error")).toBeInTheDocument());
    });

    it("renders current time in the header", async () => {
        // should show current time in the header
        vi.spyOn(api, "getWorkpodCalendar").mockImplementation(() => Promise.resolve([]));
        render(
            <MemoryRouter initialEntries={[{ state: { date: new Date(now) } }]}>
                <SearchResults />
            </MemoryRouter>
        );
        const expectedText = `searchresults-available ${format(now, "dd/MM/yyyy HH:mm")}`;
        expect(await screen.findByText(expectedText)).toBeInTheDocument();
    });

    it("renders an available workpod", async () => {
        // should render an available workpod
        const mockStart = new Date(now);
        mockStart.setHours(mockStart.getHours() - 1);
        const mockEnd = new Date(now);
        mockEnd.setHours(mockEnd.getHours() + 1);

        const { data } = useWorkpods();
        vi.spyOn(api, "getWorkpodCalendar").mockImplementation((workpodId) => {
            if (workpodId === (data![0].alias || "Room1-A")) { // ensure Room1-A is available
                return Promise.resolve([]); 
            }
            if (workpodId === "Room1-B" || workpodId === "Room2-A") {
                return Promise.resolve([
                    {
                        id: "event1",
                        title: "lab",
                        start: mockStart.toISOString(),
                        end: mockEnd.toISOString(),
                        description: "user_email: user@lab.fi"
                    }
                ]);
            }
            return Promise.resolve([]);
        });

        render(
            <MemoryRouter initialEntries={[{ state: { date: new Date(now) } }]}>
                <SearchResults />
            </MemoryRouter>
        );
        // look for an ul with class "available-results"
        const availableList = await waitFor(() => {
            const el = document.querySelector("ul.available-results");
            if (!el) throw new Error("Not found yet");
            return el;
        });
        expect(availableList).toBeInTheDocument();
        // look for Room1-A in the available list
        expect(availableList).toHaveTextContent(data![0].alias || "Room1-A");
    });

    it("renders a reserved workpod", async () => {
        const mockStart = new Date(now);
        mockStart.setHours(mockStart.getHours() - 1);
        const mockEnd = new Date(now);
        mockEnd.setHours(mockEnd.getHours() + 1);

        vi.spyOn(api, "getWorkpodCalendar").mockImplementation((workpodId) => {
            if (workpodId === (data![0].alias || "Room1-A")) { // ensure Room1-A is reserved
                return Promise.resolve([{
                    "id": "2g0b6trhf202uq87pj4r567a80",
                    "title": "lab",
                    "start": mockStart.toISOString(),
                    "end": mockEnd.toISOString(),
                    "description": "user_email: user@lab.fi"
                }]);
            }
            return Promise.resolve([]); // other workpods are not reserved
        });

        const { data } = useWorkpods();
        render(
            <MemoryRouter initialEntries={[{ state: { date: new Date(now) } }]}>
                <SearchResults />
            </MemoryRouter>
        );
        // look for an ul with class "reserved-results"
        const reservedList = await waitFor(() => {
            const el = document.querySelector("ul.reserved-results");
            if (!el) throw new Error("Not found yet");
            return el;
        });
        expect(reservedList).toBeInTheDocument();
        // look for Room1-A in the reserved list
        expect(reservedList).toHaveTextContent(data![0].alias || "Room1-A");
    });

    it("renders no reserved workpods", async () => {
        // if no workpods are reserved, there should be a message stating that
        // mock a situation with no reserved workpods
        vi.spyOn(api, "getWorkpodCalendar").mockImplementation(() => Promise.resolve([]));

        render(
            <MemoryRouter initialEntries={[{ state: { date: new Date(now) } }]}>
                <SearchResults />
            </MemoryRouter>
        );
        const text = await screen.findByText("searchresults-no-reserved");
        expect(text).toBeInTheDocument();
    });

    it("renders no available workpods", async () => {
        // if no workpods are available, there should be a message stating that
        // mock a situation with all workpods reserved
        vi.spyOn(api, "getWorkpodCalendar").mockImplementation(() => Promise.resolve([]));

        const mockStart = new Date(now);
        mockStart.setHours(mockStart.getHours() - 1);
        const mockEnd = new Date(now);
        mockEnd.setHours(mockEnd.getHours() + 1);

        vi.spyOn(api, "getWorkpodCalendar").mockImplementation(() => Promise.resolve([{
            "id": "2g0b6trhf202uq87pj4r567a80",
            "title": "lab",
            "start": mockStart.toISOString(),
            "end": mockEnd.toISOString(),
            "description": "user_email: user@lab.fi"
        }]));

        render(
            <MemoryRouter initialEntries={[{ state: { date: new Date(now) } }]}>
                <SearchResults />
            </MemoryRouter>
        );
        const text = await screen.findByText("searchresults-no-available");
        expect(text).toBeInTheDocument();
    });
});
