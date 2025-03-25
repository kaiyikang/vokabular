import { contextBridge, ipcRenderer } from "electron";

function createIpcProxy(config) {
    const result = {};
    Object.entries(config).forEach(([serviceName, methods]) => {
        result[serviceName] = {};

        methods.forEach((method) => {
            const methodName =
                typeof method === "string" ? method : method.name;
            const action = method.action || "invoke";
            const channel = method.channel || `${serviceName}:${methodName}`;

            if (method.paramTransform) {
                result[serviceName][methodName] = (...args) =>
                    ipcRenderer[action](
                        channel,
                        method.paramTransform(...args),
                    );
            } else {
                result[serviceName][methodName] = (...args) =>
                    ipcRenderer[action](channel, ...args);
            }
        });
    });

    return result;
}

const servicesConfig = {
    chat: [
        {
            name: "generateWordExplanation",
            paramTransform: (queriedSentence, queriedWord) => ({
                queriedSentence,
                queriedWord,
            }),
        },
        "getProviders",
        "getModelsForProvider",
        {
            name: "updateSelectedModel",
            paramTransform: (provider, modelId) => ({ provider, modelId }),
        },
        "testConnection",
        "getModelsByProvider",
    ],
    anki: [
        "addNoteToAnki",
        { name: "checkAnkiHealth", channel: "anki:checkHealth" },
        "getAnkiSettings",
        {
            name: "setAnkiSettings",
            action: "send",
            channel: "anki:setAnkiSettings",
        },
    ],
    settings: [
        { name: "open", action: "send" },
        "save",
        "loadDefaultProvider",
        "loadApiKeyByProvider",
    ],
};

const services = createIpcProxy(servicesConfig);

const electronApi = {
    getClipboardText: () => ipcRenderer.invoke("main:getClipboardText"),
};

contextBridge.exposeInMainWorld("services", services);
contextBridge.exposeInMainWorld("electronApi", electronApi);
