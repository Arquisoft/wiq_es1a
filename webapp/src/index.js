import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

var r = document.getElementById('root');
r.setAttribute("data-theme", "light")
const root = ReactDOM.createRoot(r);
localStorage.setItem("selectedThemes", JSON.stringify(["paises", "literatura", "cine", "arte", "programacion"]));

root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
