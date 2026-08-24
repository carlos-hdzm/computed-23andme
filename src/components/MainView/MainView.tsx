import React, { useState } from "react";
import "./MainView.less";
import TopPanel from "../TopPanel/TopPanel";
import MainPanel from "../MainPanel/MainPanel";
import type { MainPanelViewType } from "../../types";
import Footer from "../Footer/Footer";

const MainView: React.FC = React.memo(() => {
  const [mainPanelView, setMainPanelView] =
    useState<MainPanelViewType>("regions");

  return (
    <>
      <main className="main-view">
        <TopPanel
          mainPanelView={mainPanelView}
          setMainPanelView={setMainPanelView}
        />
        <MainPanel mainPanelView={mainPanelView} />
      </main>
      <Footer />
    </>
  );
});

export default MainView;
