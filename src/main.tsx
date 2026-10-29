import React from "react";
import ReactDOM from "react-dom/client";
import { MotionConfig } from "motion/react";
import "@fontsource-variable/geist";
import "lenis/dist/lenis.css";
import "./styles.css";
import App from "./App";
import SmoothScroll from "./components/SmoothScroll";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <App />
    </MotionConfig>
  </React.StrictMode>,
);
