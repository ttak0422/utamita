import * as React from "react";
import * as ReactDOM from "react-dom";
import { chromeGet, chromeSet } from "./chrome";
import { APP_ID, keys } from "./util";

require("./styles.scss");

const enableSwitchID = APP_ID + "_enable";

const defaults = {
    enable: true,
}

const Switch: React.FunctionComponent<{
    id: string
    storageKey: string
    label: string
    checked: boolean
}> = (props) => {
    const [checked, setChecked] = React.useState(props.checked);

    React.useEffect(() => {
        (async () => {
            await chromeSet(props.storageKey, checked);
        })();
    })

    return (
        <div className="field">
            <input
                id={props.id}
                className="switch"
                type="checkbox"
                checked={checked}
                onChange={(_ev: any) => setChecked(!checked)}
            />
            <label
                htmlFor={props.id}>
                {props.label}
            </label>
        </div>
    )
}

class App extends React.Component {
    state = {
        initialEnable: defaults.enable,
        isLoading: true,
    };
    async componentDidMount() {
        let savedEnable = await chromeGet(keys.enabled);
        if (savedEnable === undefined) {
            await chromeSet(keys.enabled, defaults.enable);
            this.setState({ initialEnable: defaults.enable, isLoading: false });
        } else {
            let enable = savedEnable as boolean;
            this.setState({ initialEnable: enable, isLoading: false });
        }
    }
    render() {
        return (
            <div className="container">
                {this.state.isLoading
                    ? (
                        <p>loading...</p>
                    )
                    : (
                        <nav className="level">
                            <div className="level-left">
                                <div className="level-item">
                                    <p className="subtitle">
                                        <strong>Advertising Video Volume Control</strong>
                                    </p>
                                </div>
                                <div className="level-item">
                                    <Switch
                                        id={enableSwitchID}
                                        storageKey={keys.enabled}
                                        label="enabled"
                                        checked={this.state.initialEnable}
                                    />
                                </div>
                            </div>
                        </nav>
                    )}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector("#popup"))
