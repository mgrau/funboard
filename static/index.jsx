import React from "react";
import ReactDOM from "react-dom";

import Funboard from "./funboard";

ReactDOM.render(
  <Funboard api={window.location.href} />,
  document.getElementById("root")
);
