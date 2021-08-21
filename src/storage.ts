type KVP = 
    | { type: "my-mute", value: boolean }

export const save = (key: KVP["type"], value: KVP["value"]) => {
    switch (key) {
        case "my-mute": 
            localStorage.setItem(key, String(value));
    }
}

export const getWithDefault = (key: KVP["type"], defaultValue: KVP["value"]): KVP["value"] => {
    switch (key) {
        case "my-mute":
            return localStorage.getItem(key)?.toLocaleLowerCase() === "true" || defaultValue;
    }
}