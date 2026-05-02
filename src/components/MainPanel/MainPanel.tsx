import React, { useContext } from "react";
import ChromosomeViewer from "../ChromosomeViewer/ChromosomeViewer";
import Proportions from "../Proportions/Proportions";
import classNames from "classnames";
import regionStyles from "../../styles/regions.module.less";
import "./MainPanel.less";
import { AppContext } from "../../context/context";
import FileSelector from "../FileSelector/FileSelector";
import SampleData from "../SampleData/SampleData";
import { useFileUpload } from "../../context/FileUploadContext";

const MainPanel: React.FC = () => {
  const { version } = useContext(AppContext);

  const {
    isInitial,
    isPending,
    error,
    isDone,
  } = useFileUpload();

  return (
    <section
      className={classNames("main-panel", {
        [regionStyles[version.replace(".", "_")]]: isDone,
        "initial-panel": isInitial,
        "error-panel": !!error,
        "pending-panel": isPending,
      })}
    >
      {isDone && !error && (
        <>
          <Proportions />
          <ChromosomeViewer />
        </>
      )}
      {isInitial && (
        <FileSelector />
      )}
      {error && (
        <div>Error processing file: {error.message}</div>
      )}
      { (isInitial || error) && (<SampleData />) }
    </section>
  );
};

export default MainPanel;
