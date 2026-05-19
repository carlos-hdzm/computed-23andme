import React, { useCallback } from "react";
import './FileSelector.less';
import { useFileUpload } from "../../context/FileUploadContext";
import processCSVString from "../../data-processing";

const FileSelector: React.FC = React.memo(() => {
  const {
    processFile,
  } = useFileUpload({ processData: processCSVString });

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    processFile(file);
  }, [processFile]);

  const handleDrag = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.stopPropagation();
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file || file.type !== 'text/csv') return;

    processFile(file);
  }, [processFile]);

  return (<div className='file-selector'>
    <input
      type='file'
      name='file-input'
      id='file-input'
      accept='text/csv'
      className='visually-hidden'
      onChange={handleFileUpload}
    />
    <label
      htmlFor='file-input'
      className='drop-zone'
      onDragOver={handleDrag}
      onDragEnter={handleDrag}
      onDrop={handleDrop}
    >
      Click to upload or drop your Computed Data (CSV) file.
    </label>
  </div>);
});

export default FileSelector;