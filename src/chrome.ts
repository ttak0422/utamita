/**
 * 
 * @param key chrome.storageの保存に使う．
 * @returns 値が存在しなければundefinedになる．
 */
export const chromeGet = (key: string): Promise<any> =>
    new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, items => {
            resolve(items[key]);
        })
    });

export const chromeSet = (key: string, value: any): Promise<void> =>
    new Promise((resolve, reject) => {
        let v: any = {};
        v[key] = value;
        chrome.storage.sync.set(v, resolve);
    })