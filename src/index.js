import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from react-dom/client
import App from './App';
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root'); // Get the root element
const root = ReactDOM.createRoot(container); // Create a root

root.render( // Render the App component
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
