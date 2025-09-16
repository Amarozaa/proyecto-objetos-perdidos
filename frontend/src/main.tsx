import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// El enrutamiento se gestiona en App.tsx usando React Router

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  throw new Error('No se encontró el elemento root en el HTML');
}
