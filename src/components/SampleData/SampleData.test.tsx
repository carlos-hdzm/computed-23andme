import { describe, test, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import contextActions from "../../context/actions";
import { useFileUpload } from "../../context/FileUploadContext";
import AppContextProvider from "../../context/AppContext";
import SampleData from "./SampleData";
import getSampleContextData from "../../context/sample-data";
import type { ContextData } from "../../types";

vi.mock(import("../../context/sample-data"));

const TestComponent = () => {
  const {
    state: { isSampleData },
  } = useFileUpload();

  return (
    <>
      <p>isSampleData: {isSampleData.toString()}</p>
      <SampleData />
    </>
  );
};

const renderComponent = async () => {
  return await render(
    <AppContextProvider>
      <TestComponent />
    </AppContextProvider>,
  );
};

describe("SampleData", () => {
  test("should render correctly on initial render", async () => {
    const { getByText } = await renderComponent();

    await expect
      .element(getByText("Use sample data to get started"))
      .toBeInTheDocument();
  });

  test("should set sample data on click of the button", async () => {
    const sampleDataMock = {
      version: "v5.2",
      confidence: 50,
      highlight: "",
      data: { test: "data" },
    } as ContextData;

    vi.mocked(getSampleContextData).mockResolvedValue(sampleDataMock);
    const setSampleDataActionSpy = vi.spyOn(contextActions, "setSampleData");

    const { getByText, getByTestId } = await renderComponent();

    await expect.element(getByText("isSampleData: false")).toBeInTheDocument();
    await getByTestId("use-sample-data-button").click();
    expect(setSampleDataActionSpy).toHaveBeenCalled();
    await expect.element(getByText("isSampleData: true")).toBeInTheDocument();
  });
});
