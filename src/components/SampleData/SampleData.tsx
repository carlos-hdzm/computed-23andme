import React, { useContext } from "react";
import { AppDispatchContext } from "../../context/context";
import "./SampleData.less";
import { useFileUpload } from "../../context/FileUploadContext";

const SampleData: React.FC = () => {
  const dispatch = useContext(AppDispatchContext);
  const { handleSampleData } = useFileUpload();

  const handleUseSampleData = handleSampleData(dispatch);

  return (
    <div className="sample-data">
      <button data-testid="use-sample-data-button" onClick={handleUseSampleData}>Use sample data to get started</button>
    </div>
  );
};

export default SampleData;