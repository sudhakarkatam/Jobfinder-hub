import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tailwind.css';
import './styles/index.css';
import App from './App.jsx';

// React DevTools setup for better development experience
if (import.meta.env.DEV) {
  // Enable React DevTools in development
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
  
  // Add development console message
  console.log('🚀 React DevTools: Install the browser extension for better debugging');
  console.log('📖 React DevTools: https://reactjs.org/link/react-devtools');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
