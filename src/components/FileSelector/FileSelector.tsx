import { useCallback, useContext } from "react";
import { useAsync } from "react-async";
import { AppContext, AppDispatchContext } from "../../context/context";
import './FileSelector.less';

const FileSelector = () => {
  const { data } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const { isPending, isFulfilled, error, run } = useAsync({ deferFn: async () => { } });

  const processFile = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        run(text);
      } catch (err) {
        console.error('Error processing file:', err);
      }
    };
    reader.onerror = (event) => {
      console.error('Error reading file:', event.target?.error);
    };
    reader.readAsText(file);
  }, [run]);

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

  return (<>
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

    </label>
  </>)
};

export default FileSelector;