import { test, describe, expect, vi } from "vitest";
import processCSVString from "./index";
import csv from "csvtojson";
import { populateDataTemplate } from "./populateDataTemplate";
import { nestRegions } from "./processData";
import type { ChromosomeHaplotypeNoSplit, ComputedData, UnsortedRegionsEntry } from "../types";

vi.mock(import("csvtojson"), () => ({
  default: vi.fn(() => ({
    fromString: vi.fn(async () => []),
  })),
} as unknown as typeof import("csvtojson")));

vi.mock(import("./populateDataTemplate"), () => ({
    populateDataTemplate: vi.fn(() => ({} as ComputedData<ChromosomeHaplotypeNoSplit, UnsortedRegionsEntry>)),
}));

vi.mock(import("./processData"), () => ({
    nestRegions: vi.fn(() => ({
        value: 'success',
    } as ComputedData)),
}));

describe("processCSVString", () => {
    test("when CSV parsing is successful", async () => {
        await expect(processCSVString("test_csv_string")).resolves.toEqual({
            value: 'success',
        });
    });

    describe("when CSV parsing fails", () => {
        test("error on CSV parsing", async () => {
            const error = new Error("CSV parsing failed");
            const fromStringMock = vi.fn().mockRejectedValueOnce(error);
            vi.mocked(csv).mockReturnValueOnce({
                fromString: fromStringMock,
            } as unknown as ReturnType<typeof csv>);
            await expect(processCSVString("test_csv_string")).rejects.toThrow('Error processing CSV data: CSV parsing failed');
        });

        test("error on template population", async () => {
            const error = new Error("Template population failed");
            vi.mocked(populateDataTemplate).mockThrowOnce(error);
            await expect(processCSVString("test_csv_string")).rejects.toThrow('Error processing CSV data: Template population failed');
        });

        test("error on region nesting", async () => {
            const error = new Error("Region nesting failed");
            vi.mocked(nestRegions).mockThrowOnce(error);
            await expect(processCSVString("test_csv_string")).rejects.toThrow('Error processing CSV data: Region nesting failed');
        });
    });
});