import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import messageSound from "./notification.mp3";

const sound = new Audio(messageSound);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App sound={sound} />
  </React.StrictMode>
);

reportWebVitals();
