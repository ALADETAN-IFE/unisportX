// import './App.css';
import { RouterProvider } from 'react-router-dom';
import Routes from './routes/Route';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InstallPrompt from './components/InstallPrompt';
import NetworkActivity from './components/NetworkActivity';

const App = () => {
  return (
    <>
      <NetworkActivity />
      <InstallPrompt />
      <RouterProvider router={Routes} />
      <ToastContainer position='top-right' autoClose={2800} />
    </>
  )
}

export default App