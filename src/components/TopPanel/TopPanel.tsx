import React, { useCallback, useContext, useMemo } from "react";
import classNames from "classnames";
import { AppContext, AppDispatchContext } from "../../context/context";
import contextActions from "../../context/actions";
import "./TopPanel.less";
import type { ConfidenceType, VersionType } from "../../context/types";
import {
  confidenceLabels,
  confidenceValues,
  versionLabels,
} from "../../util/strings";
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

  const { reset, isSampleData, error, isDone } = useFileUpload();

  const handleVersionChange = useCallback(
    ({ target: { value } }: ChangeEvent<VersionType>) => {
      if (value !== "v7.0" && confidence === "mostLikely") {
        dispatch(contextActions.setConfidence(50));
      }
      dispatch(contextActions.setVersion(value));
    },
    [dispatch, confidence],
  );

  const handleConfidenceChange = useCallback(
    ({ target: { value } }: ChangeEvent<ConfidenceType>) => {
      dispatch(contextActions.setConfidence(value));
    },
    [dispatch],
  );

  const handleDelete = useCallback(() => {
    reset();
    dispatch(contextActions.clearData());
  }, [reset, dispatch]);

  const availableVersions = useMemo(() => getAvailableVersions(data), [data]);

  return (
    <section className="top-panel">
      {isDone && !error && (
        <>
          <div className="file-uploaded">
            {isSampleData ? "Sample data loaded" : "Data uploaded"}
            <a href="#" onClick={handleDelete}>
              Delete
            </a>
          </div>
          <div
            className={classNames("controls", {
              active: Object.keys(data).length > 0,
            })}
          >
            <div className="version">
              <select
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
                name="confidence"
                value={confidence}
                onChange={handleConfidenceChange}
              >
                {confidenceValues[version].map((confidence) => (
                  <option key={confidence} value={confidence}>
                    {confidenceLabels[confidence]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default TopPanel;
