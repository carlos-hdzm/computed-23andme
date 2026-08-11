import { describe, test, expect, beforeEach, vi } from "vitest";
import { render } from "vitest-browser-react";
import { AppContext } from "./context";
import { FileUploadPropsContext } from "./FileUploadContext/FileUploadContextProvider";
import type { ComputedData } from "../types";
import AppContextProvider from "./AppContext";
import { useContext, useEffect } from "react";

describe("AppContextProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders children", async () => {
    const { getByText } = await render(
      <AppContextProvider>
        <div>Child Component</div>
      </AppContextProvider>,
    );
    await expect.element(getByText("Child Component")).toBeInTheDocument();
  });

  test("updates AppContext when FileUpload onResolve is called", async () => {
    const ConsumerTestComponent = ({
      mode = "initial",
    }: {
      mode?: "initial" | "update";
    }) => {
      const { data, version, confidence, highlight } = useContext(AppContext);
      const { onResolve: saveData } = useContext(FileUploadPropsContext);

      useEffect(() => {
        if (mode === "update") {
          saveData({ "v7.0": {} } as ComputedData);
        }
      }, [mode, saveData]);

      return (
        <div>
          <p>Data: {JSON.stringify(data)}</p>
          <p>Version: [{version}]</p>
          <p>Confidence: [{confidence}]</p>
          <p>Highlight: [{highlight}]</p>
        </div>
      );
    };

    const { getByText, rerender } = await render(
      <AppContextProvider>
        <ConsumerTestComponent />
      </AppContextProvider>,
    );

    await expect.element(getByText("Data: {}")).toBeInTheDocument();
    await expect.element(getByText("Version: []")).toBeInTheDocument();
    await expect.element(getByText("Confidence: []")).toBeInTheDocument();
    await expect.element(getByText("Highlight: []")).toBeInTheDocument();

    await rerender(
      <AppContextProvider>
        <ConsumerTestComponent mode="update" />
      </AppContextProvider>,
    );

    await expect.element(getByText("Data: {\"v7.0\":{}}")).toBeInTheDocument();
    await expect.element(getByText("Version: [v7.0]")).toBeInTheDocument();
    await expect.element(getByText("Confidence: [mostLikely]")).toBeInTheDocument();
    // Highlight is not affected by the saveData call, so it should remain the same
    await expect.element(getByText("Highlight: []")).toBeInTheDocument();
  });

  test("doesn't update AppContext when FileUpload onResolve is called with invalid data", async () => {
    const ConsumerTestComponent = ({
      mode = "initial",
    }: {
      mode?: "initial" | "update";
    }) => {
      const { data, version, confidence, highlight } = useContext(AppContext);
      const { onResolve: saveData } = useContext(FileUploadPropsContext);

      useEffect(() => {
        if (mode === "update") {
          saveData("" as unknown as ComputedData);
        }
      }, [mode, saveData]);

      return (
        <div>
          <p>Data: {JSON.stringify(data)}</p>
          <p>Version: [{version}]</p>
          <p>Confidence: [{confidence}]</p>
          <p>Highlight: [{highlight}]</p>
        </div>
      );
    };

    const { getByText, rerender } = await render(
      <AppContextProvider>
        <ConsumerTestComponent />
      </AppContextProvider>,
    );

    await expect.element(getByText("Data: {}")).toBeInTheDocument();
    await expect.element(getByText("Version: []")).toBeInTheDocument();
    await expect.element(getByText("Confidence: []")).toBeInTheDocument();
    await expect.element(getByText("Highlight: []")).toBeInTheDocument();

    await rerender(
      <AppContextProvider>
        <ConsumerTestComponent mode="update" />
      </AppContextProvider>,
    );

    // Data should remain the same
    await expect.element(getByText("Data: {}")).toBeInTheDocument();
    await expect.element(getByText("Version: []")).toBeInTheDocument();
    await expect.element(getByText("Confidence: []")).toBeInTheDocument();
    await expect.element(getByText("Highlight: []")).toBeInTheDocument();
  });
});
