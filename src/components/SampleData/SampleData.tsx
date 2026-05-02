import React, { useCallback, useContext } from "react";
import { AppDispatchContext } from "../../context/context";
import "./SampleData.less";
import contextActions from "../../context/actions";
import { useFileUpload } from "../../context/FileUploadContext";

const SampleData: React.FC = () => {
  const dispatch = useContext(AppDispatchContext);
  const { setUsingSampleData } = useFileUpload();

  const handleUseSampleData = useCallback(() => {
    dispatch(contextActions.setSampleData());
    setUsingSampleData();
  }, [dispatch, setUsingSampleData]);

  return (
    <div className="sample-data">
      <button onClick={handleUseSampleData}>Use sample data to get started</button>
    </div>
  );
};

export default SampleData;