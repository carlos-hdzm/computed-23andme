import React from 'react';
import './MainView.less';
import TopPanel from '../TopPanel/TopPanel';
import MainPanel from '../MainPanel/MainPanel';

const MainView: React.FC = React.memo(() => {
  return (<main className='main-view'>
    <TopPanel />
    <MainPanel />
  </main>);
});

export default MainView;