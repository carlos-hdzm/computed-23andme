import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { AppContext, AppDispatchContext } from '../../context/context';
import Proportions from '../Proportions/Proportions';
import ChromosomeViewer from '../ChromosomeViewer/ChromosomeViewer';
import './MainView.less';
import regionStyles from '../../styles/regions.module.less';
import type { ConfidenceType, VersionType } from '../../context/reducer';
import FileSelector from '../FileSelector/FileSelector';

type ChangeEvent<Type> = React.ChangeEvent<HTMLSelectElement, HTMLSelectElement> & {
  target: {
    value: Type
  }
}

const MainView = () => {
  const { data, version, confidence } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const handleVersionChange = useCallback(({ target: { value } }: ChangeEvent<VersionType>) => {
    if (value !== 'v7.0' && confidence === 'mostLikely') {
      dispatch({ type: 'SET_CONFIDENCE', confidence: 50 });
    }
    dispatch({ type: 'SET_VERSION', version: value });
  }, [dispatch, confidence]);

  const handleConfidenceChange = useCallback(({ target: { value } }: ChangeEvent<ConfidenceType>) => {
    dispatch({ type: 'SET_CONFIDENCE', confidence: value });
  }, [dispatch]);

  return (<main className='main-view'>
    <section className='top-panel'>
      <div className='file-selector'>
        <FileSelector />
      </div>
      <div className={classNames('controls', { 'active': Object.keys(data).length > 0 })}>
        <div className='version'>
          <select name='version' value={version} onChange={handleVersionChange}>
            <option value='v5.2'>v5.2</option>
            <option value='v5.9'>v5.9</option>
            <option value='v7.0'>v7.0</option>
          </select>
        </div>
        <div className='confidence'>
          <select name='confidence' value={confidence} onChange={handleConfidenceChange}>
            {version === 'v7.0' && <option value='mostLikely'>Most likely</option>}
            <option value='50'>50</option>
            <option value='60'>60</option>
            <option value='70'>70</option>
            <option value='80'>80</option>
            <option value='90'>90</option>
          </select>
        </div>
      </div>
    </section>
    <section className={classNames('main-panel', regionStyles[version.replace('.', '_')])}>
      <Proportions />
      <ChromosomeViewer />
    </section>
  </main>);
};

export default MainView;