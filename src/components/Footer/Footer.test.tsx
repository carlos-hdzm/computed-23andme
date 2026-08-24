import { describe, test, expect } from "vitest";
import { render } from "vitest-browser-react";
import Footer from "./Footer";

describe("Footer", () => {
    test("renders correctly", async () => {
        const { getByText, getByRole } = await render(<Footer />);

        await expect.element(getByText("Carlos Hernandez-Schaefer")).toBeInTheDocument();
        await expect.poll(() => getByRole("link")).toHaveLength(2);
        await expect.element(getByText("Other projects")).toBeInTheDocument();
        await expect.element(getByText("Source code")).toBeInTheDocument();
    });
});