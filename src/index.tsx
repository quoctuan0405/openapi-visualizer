import React from 'react';
import ReactDOM from 'react-dom/client';
// import { scan } from 'react-scan';
import App from './App';

// scan({
//   enabled: true,
// });

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
