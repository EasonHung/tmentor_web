import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <div>
      <ToastContainer />
      <RouterProvider router={ router }/>
    </div>
  )
}

export default App;
