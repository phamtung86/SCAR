import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './assets/style/Global.css';
import './index.css';
import Login from './pages/Login';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';

const Main = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path='/Login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  )
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

reportWebVitals();
