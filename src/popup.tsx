import React from "react";
import * as ReactDOM from "react-dom";

require("./styles.scss");

/**
 * just link for option page
 * @returns popup
 */
const App = () => {
  const openOptionPage = () => {
  };
  return (
    <div className="container">
      The setting method has been changed.

      <a href="#" onClick={(_ev) => openOptionPage()}>
        option page
      </a>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#popup"));
