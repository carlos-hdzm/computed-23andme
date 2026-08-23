import React, { useCallback, useContext, useMemo } from "react";
import classNames from "classnames";
import { AppContext, AppDispatchContext } from "../../context/context";
import contextActions from "../../context/actions";
import "./TopPanel.less";
import type { ConfidenceLevel, ModelVersion } from "../../types";
import {
  confidenceLabels,
  confidenceValues,
  versionLabels,
} from "../../constants/strings";
import { useFileUpload } from "../../context/FileUploadContext";
import { getAvailableVersions } from "../../context/contextUtil";

type ChangeEvent<Type> = React.ChangeEvent<
  HTMLSelectElement,
  HTMLSelectElement
> & {
  target: {
    value: Type;
  };
};

const TopPanel: React.FC = () => {
  const { data, version, confidence } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const { reset, state: { isSampleData, error, isDone } } = useFileUpload();

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

  return (
    <section className="top-panel" data-testid="top-panel">
      <div className="logo-container">
        <h1>Computed<br />23andMe</h1>
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
                {version && confidenceValues[version].map((confidence) => (
                  <option key={confidence} value={confidence}>
                    {confidenceLabels[confidence]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TopPanel;
