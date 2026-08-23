import React, { useCallback } from "react";
import "./FileError.less";
import { useFileUpload } from "../../context/FileUploadContext";

const FileError: React.FC = () => {
  const { reset } = useFileUpload();

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="file-error">
      <div>Error processing file. Please try again or use sample data.</div>
      <a href="#" onClick={handleReset}>Retry</a>
    </div>
  );
};

export default FileError;