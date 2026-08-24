import { describe, test, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import App from "./App";

vi.mock(import("./components/MainView/MainView"), () => ({
    default: () => (<p>MainView</p>),
}));

describe("App", () => {
    test("should render correctly", async () => {
        const { getByText } = await render(<App />);

        await expect.element(getByText("Skip to main content")).toBeInTheDocument();
        await expect.element(getByText("MainView")).toBeInTheDocument();
    });
});