import React, { useContext } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
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
import type { MainPanelViewType } from "../../types";

export type MainPanelProps = {
  mainPanelView: MainPanelViewType
}

const MainPanel: React.FC<MainPanelProps> = ({ mainPanelView }) => {
  const { version } = useContext(AppContext);
  const isMobile = useMediaQuery("screen and (max-width: 767px)");

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
          <Proportions panelHidden={!(!isMobile || mainPanelView === "regions")} />
          <ChromosomeViewer panelHidden={!(!isMobile || mainPanelView === "chromosomes")} />
        </>
      )}
      {isInitial && <FileSelector />}
      {error && <FileError />}
      {(isInitial || error) && <SampleData />}
    </section>
  );
};

export default MainPanel;
