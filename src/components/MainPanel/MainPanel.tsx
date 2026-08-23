import React, { useContext } from "react";
import ChromosomeViewer from "../ChromosomeViewer/ChromosomeViewer";
import Proportions from "../Proportions/Proportions";
import classNames from "classnames";
import regionStyles from "../../styles/regions.module.less";
import "./MainPanel.less";
import { AppContext } from "../../context/context";
import FileSelector from "../FileSelector/FileSelector";
import FileError from "../FileError/FileError";
import SampleData from "../SampleData/SampleData";
import { useFileUpload } from "../../context/FileUploadContext";

const MainPanel: React.FC = () => {
  const { version } = useContext(AppContext);

  const {
    state: { isInitial, isPending, error, isDone },
  } = useFileUpload();

  return (
    <section
      data-testid="main-panel"
      className={classNames("main-panel", {
        [regionStyles[version.replace(".", "_")]]: version && isDone,
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
      {isInitial && <FileSelector />}
      {error && <FileError />}
      {(isInitial || error) && <SampleData />}
    </section>
  );
};

export default MainPanel;
