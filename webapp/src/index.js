import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import './themes.js';
import './index.css';
import i18n from './i18n';

var r = document.getElementById("root");
const root = ReactDOM.createRoot(r);

localStorage.setItem(
  "selectedThemes",
  JSON.stringify(["paises", "literatura", "cine", "arte", "programacion"])
);
localStorage.setItem("clasicoTime", 10);
localStorage.setItem("clasicoPreguntas", 10);
localStorage.setItem("bateriaTime", 180);

root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
