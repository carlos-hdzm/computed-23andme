import AppContextProvider from './context/AppContext'
import MainView from './components/MainView/MainView'
import './App.less'

function App() {
  return (<>
    <a href="#main-panel" aria-hidden="true" id="skip-link">Skip to main content</a>
    <AppContextProvider>
      <MainView />
    </AppContextProvider>
  </>)
}

export default App
