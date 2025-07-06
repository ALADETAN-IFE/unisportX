import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './global/Redux-Store/Store'
import LoadingScreen from './components/LoadingScreen'

// Register the PWA service worker
// @ts-expect-error virtual:pwa-register is a Vite plugin that generates this module at build time
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {
    console.log('App is ready to work offline!');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen/>} persistor={persistor}>
          <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
