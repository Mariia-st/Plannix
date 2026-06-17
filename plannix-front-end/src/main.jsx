import { BrowserRouter  } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from './service/UserProvider.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <UserProvider>

    <App />
  </UserProvider>
  </BrowserRouter>,
)
