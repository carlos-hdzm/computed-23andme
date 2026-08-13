import { describe, test, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import contextActions from "../../context/actions";
import { useFileUpload } from "../../context/FileUploadContext";
import AppContextProvider from "../../context/AppContext";
import SampleData from "./SampleData";

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

  test("should set sample data on click or the button", async () => {
    const setSampleDataActionSpy = vi.spyOn(contextActions, "setSampleData");

    const { getByText, getByTestId } = await renderComponent();

    await expect.element(getByText("isSampleData: false")).toBeInTheDocument();
    await getByTestId("use-sample-data-button").click();
    expect(setSampleDataActionSpy).toHaveBeenCalled();
    await expect.element(getByText("isSampleData: true")).toBeInTheDocument();
  });
});
