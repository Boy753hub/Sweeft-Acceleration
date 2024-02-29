
import { RouterProvider } from 'react-router';
import './App.css'
import { createBrowserRouter } from 'react-router-dom';
import { router } from './routes/router';

function App() {
  return (
    <RouterProvider router={createBrowserRouter(router)}/>
  );
}

export default App
