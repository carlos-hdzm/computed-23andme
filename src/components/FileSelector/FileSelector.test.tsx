import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-react";
import FileSelector from "./FileSelector";

const processFileMock = vi.fn();

vi.mock(import("../../context/FileUploadContext"), async (importOriginal) => {
  const originalModule = await importOriginal();

  return {
    ...originalModule,
    useFileUpload: () => ({
      processFile: processFileMock,
    }),
  } as unknown as typeof import("../../context/FileUploadContext");
});

describe("FileSelector", () => {
  beforeEach(() => {
    processFileMock.mockClear();
  });

  test("renders correctly", async () => {
    const { getByLabelText, getByText } = await render(<FileSelector />);

    const labelText = "Click to upload or drop your Computed Data (CSV) file.";
    await expect.element(getByText(labelText)).toBeInTheDocument();
    await expect.element(getByLabelText(labelText)).toBeInTheDocument();
  });

  describe("accepts CSV files", () => {
    test("with file input change", async () => {
      const { getByLabelText } = await render(<FileSelector />);

      const labelText =
        "Click to upload or drop your Computed Data (CSV) file.";

      const file = new File(["a,b\n1,2"], "sample.csv", { type: "text/csv" });
      await getByLabelText(labelText).upload([file]);

      expect(processFileMock).toHaveBeenCalledTimes(1);
      expect(processFileMock).toHaveBeenCalledWith(file);
    });

    test("with drop on the label", async () => {
      const { getByText } = await render(<FileSelector />);

      const labelText =
        "Click to upload or drop your Computed Data (CSV) file.";

      const file = new File(["a,b\n1,2"], "sample.csv", { type: "text/csv" });

      getByText(labelText)
        .element()
        .dispatchEvent(
          new DragEvent("dragenter", {
            bubbles: true,
            cancelable: true,
          }),
        );

      getByText(labelText)
        .element()
        .dispatchEvent(
          new DragEvent("dragover", {
            bubbles: true,
            cancelable: true,
          }),
        );

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      getByText(labelText)
        .element()
        .dispatchEvent(
          new DragEvent("drop", {
            bubbles: true,
            cancelable: true,
            dataTransfer,
          }),
        );

      expect(processFileMock).toHaveBeenCalledTimes(1);
      expect(processFileMock).toHaveBeenCalledWith(file);
    });
  });

  describe("rejects non-CSV files", () => {
    const files = [
      {
        file: new File(["hello"], "sample.txt", {
          type: "text/plain",
        }),
        type: "text/plain",
      },
      {
        file: new File(["hello"], "sample.pdf", {
          type: "application/pdf",
        }),
        type: "application/pdf",
      },
      {
        file: new File(["hello"], "sample.html", {
          type: "text/html",
        }),
        type: "text/html",
      },
      {
        file: new File(["hello"], "sample.xml", {
          type: "text/xml",
        }),
        type: "text/xml",
      },
      {
        file: new File(["hello"], "sample.png", {
          type: "image/png",
        }),
        type: "image/png",
      },
    ];

    describe("with file input change", () => {
      test.for(files)("MIME type $type", async ({ file }) => {
        const { getByLabelText } = await render(<FileSelector />);

        const labelText =
          "Click to upload or drop your Computed Data (CSV) file.";

        await getByLabelText(labelText).upload([file]);
        expect(processFileMock).not.toHaveBeenCalled();
      });
    });

    describe("with drop on the label", () => {
      test.for(files)("MIME type $type", async ({ file }) => {
        const { getByText } = await render(<FileSelector />);

        const labelText =
          "Click to upload or drop your Computed Data (CSV) file.";

        getByText(labelText)
          .element()
          .dispatchEvent(
            new DragEvent("dragenter", {
              bubbles: true,
              cancelable: true,
            }),
          );

        getByText(labelText)
          .element()
          .dispatchEvent(
            new DragEvent("dragover", {
              bubbles: true,
              cancelable: true,
            }),
          );

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        getByText(labelText)
          .element()
          .dispatchEvent(
            new DragEvent("drop", {
              bubbles: true,
              cancelable: true,
              dataTransfer,
            }),
          );
      });
    });
  });
});
