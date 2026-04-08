import AppContextProvider from './context/AppContext'
import MainView from './components/MainView/MainView'
import './App.less'

function App() {
  return (
    <AppContextProvider>
      <MainView />
    </AppContextProvider>
  )
}

export default App
