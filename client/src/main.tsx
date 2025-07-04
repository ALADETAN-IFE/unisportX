import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './global/Redux-Store/Store'
import LoadingScreen from './components/LoadingScreen'
// import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen/>} persistor={persistor}>
          <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
