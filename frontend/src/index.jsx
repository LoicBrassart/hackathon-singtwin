import React from 'react';
import ReactDOM from 'react-dom';
import { Reset } from 'styled-reset';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Reset />
    <App />
    <ToastContainer position="bottom-right" />
  </React.StrictMode>,
  document.getElementById('root')
);
