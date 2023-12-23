import React from "react";
import App from "./App";
import { Provider } from "react-redux";
import Store from "./redux/store";
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>
);
