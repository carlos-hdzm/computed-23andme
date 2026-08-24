import React, { useCallback, useContext, useMemo, useRef } from "react";
import classNames from "classnames";
import { useMediaQuery } from "@uidotdev/usehooks";
import { AppContext, AppDispatchContext } from "../../context/context";
import contextActions from "../../context/actions";
import "./TopPanel.less";
import type {
  ConfidenceLevel,
  MainPanelViewType,
  ModelVersion,
} from "../../types";
import {
  confidenceLabels,
  confidenceValues,
  versionLabels,
} from "../../constants/strings";
import { useFileUpload } from "../../context/FileUploadContext";
import { getAvailableVersions } from "../../context/contextUtil";

export type TopPanelProps = {
  mainPanelView: MainPanelViewType;
  setMainPanelView: React.Dispatch<React.SetStateAction<MainPanelViewType>>;
};

type ChangeEvent<Type> = React.ChangeEvent<
  HTMLSelectElement,
  HTMLSelectElement
> & {
  target: {
    value: Type;
  };
};

const TopPanel: React.FC<TopPanelProps> = ({
  mainPanelView,
  setMainPanelView,
}) => {
  const { data, version, confidence } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const isMobile = useMediaQuery("screen and (max-width: 767px)");
  const toggleButton = useRef<HTMLButtonElement>(null);
  const mainViewToggleStatus = useRef<HTMLSpanElement>(null);

  const {
    reset,
    state: { isSampleData, error, isDone },
  } = useFileUpload();

  const handleVersionChange = useCallback(
    ({ target: { value } }: ChangeEvent<ModelVersion>) => {
      if (value !== "v7.0" && confidence === "mostLikely") {
        dispatch(contextActions.setConfidence(50));
      }
      dispatch(contextActions.setVersion(value));
    },
    [dispatch, confidence],
  );

  const handleConfidenceChange = useCallback(
    ({ target: { value } }: ChangeEvent<ConfidenceLevel>) => {
      dispatch(contextActions.setConfidence(value));
    },
    [dispatch],
  );

  const handleDelete = useCallback(() => {
    reset();
    dispatch(contextActions.clearData());
  }, [reset, dispatch]);

  const availableVersions = useMemo(() => {
    if (!data || Object.keys(data).length === 0) {
      return [];
    }

    return getAvailableVersions(data);
  }, [data]);

  const handleMainViewToggle = useCallback(() => {
    const newPanel = mainPanelView === "regions" ? "chromosomes" : "regions";
    setMainPanelView(newPanel);
    /* v8 ignore else -- @preserve */
    if (mainViewToggleStatus.current && toggleButton.current) {
      mainViewToggleStatus.current.textContent = `Now displaying ${newPanel} panel.`
      toggleButton.current.ariaLabel = `Toggle Main View, currently displaying ${newPanel} panel.`
    }
  }, [mainPanelView, setMainPanelView]);

  return (
    <section className="top-panel" data-testid="top-panel">
      <div className="logo-container">
        <h1>
          Computed
          <br />
          23andMe
        </h1>
      </div>
      {isDone && !error && (
        <div className="action-panel" data-testid="action-panel">
          <div className="file-uploaded">
            <span>
              You're viewing {isSampleData ? "sample" : "your uploaded"} data.
            </span>
            <a href="#" onClick={handleDelete}>
              Reset
            </a>
          </div>
          <div
            data-testid="controls"
            className={classNames("controls", {
              active: Object.keys(data).length > 0,
            })}
          >
            <div className="version">
              <select
                data-testid="version-select"
                name="version"
                value={version}
                onChange={handleVersionChange}
              >
                {availableVersions.map((version) => (
                  <option key={version} value={version}>
                    {versionLabels[version]}
                  </option>
                ))}
              </select>
            </div>
            <div className="confidence">
              <select
                data-testid="confidence-select"
                name="confidence"
                value={confidence}
                onChange={handleConfidenceChange}
              >
                {version &&
                  confidenceValues[version].map((confidence) => (
                    <option key={confidence} value={confidence}>
                      {confidenceLabels[confidence]}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {isMobile && (
            <>
              <button
                id="main-view-toggle"
                data-testid="main-view-toggle"
                aria-label={`Toggle Main View, currently displaying ${mainPanelView} panel.`}
                tabIndex={0}
                ref={toggleButton}
                onClick={handleMainViewToggle}
              >
                <span
                  id="main-view-regions"
                  className={classNames("main-view-button", {
                    active: mainPanelView === "regions",
                  })}
                >
                  Regions
                </span>
                <span
                  id="main-view-chromosomes"
                  className={classNames("main-view-button", {
                    active: mainPanelView === "chromosomes",
                  })}
                >
                  Chromosomes
                </span>
              </button>
              <span
                data-testid="main-view-status"
                id="main-view-status"
                className="visually-hidden"
                aria-live="polite"
                aria-atomic="true"
                ref={mainViewToggleStatus}
              ></span>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default TopPanel;
