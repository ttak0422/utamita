import React, {
  useState,
  useEffect,
  Component,
  FunctionComponent,
} from "react";
import * as ReactDOM from "react-dom";
import { AppKeys, chromeGet, chromeSet } from "./chrome";
import { APP_ID } from "./util";

require("./styles.scss");

const enableSwitchID = APP_ID + "_enable";

const defaults = {
  enable: true,
} as const;

const Switch: FunctionComponent<{
  id: string;
  storageKey: AppKeys["type"];
  label: string;
  checked: boolean;
}> = (props) => {
  const [checked, setChecked] = useState(props.checked);

  useEffect(() => {
    (async () => {
      await chromeSet(props.storageKey, checked);
    })();
  }, [checked]);

  return (
    <div className="field">
      <input
        id={props.id}
        className="switch"
        type="checkbox"
        checked={checked}
        onChange={(_ev: any) => setChecked(!checked)}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
};

const LoadingMessage = () => <p>loading...</p>;

const ControlPanel: FunctionComponent<{
  id: string;
  enabled: boolean;
}> = (props) => {
  return (
    <nav className="level">
      <div className="level-left">
        <div className="level-item">
          <p className="subtitle">
            <strong>Advertising Video Volume Control</strong>
          </p>
        </div>
        <div className="level-item">
          <Switch
            id={props.id}
            storageKey={"enabled"}
            label="enabled"
            checked={props.enabled}
          />
        </div>
      </div>
    </nav>
  );
};

type State = { type: "enabled" } | { type: "disabled" } | { type: "loading" };

const App = () => {
  const [state, setState] = useState({ type: "loading" });

  useEffect(() => {
    console.log("aaa");
    const getEnabled = async () => {
      const e = await chromeGet("enabled");
      setState({ type: e ? "enabled" : "disabled" });
      console.log(`enabled? ${e}`);
    };
    getEnabled();
  }, []);

  return (
    <div className="container">
      {state.type === "loading" ? (
        <LoadingMessage />
      ) : (
        <ControlPanel id="a" enabled={state.type === "enabled"} />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#popup"));
