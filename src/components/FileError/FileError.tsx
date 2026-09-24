import React, { useCallback } from "react";
import "./FileError.less";
import { useFileUpload } from "../../context/FileUploadContext";
import { FILE_TOO_LARGE_ERROR_CAUSE } from "../../constants/fileProcessing";

const FileError: React.FC = () => {
  const {
    state: { error },
    reset,
  } = useFileUpload();

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const errorMessage =
    error?.cause === FILE_TOO_LARGE_ERROR_CAUSE
      ? `${error.message}. Please try again with a smaller file or use sample data.`
      : "Error processing file. Please try again or use sample data.";

  return (
    <div className="file-error">
      <div>{errorMessage}</div>
      <a href="#" onClick={handleReset}>
        Retry
      </a>
    </div>
  );
};

export default FileError;
