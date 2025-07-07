import './App.css';
import { RouterProvider } from 'react-router-dom';
import Routes from './routes/Route';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InstallPrompt from './components/InstallPrompt';
import { HelmetProvider } from 'react-helmet-async';

const App = () => {
  return (
    <HelmetProvider>
      <InstallPrompt />
      <RouterProvider router={Routes} />
      <ToastContainer position='top-right' autoClose={2800} />
    </HelmetProvider>
  )
}

export default App