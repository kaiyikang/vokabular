import { contextBridge, ipcRenderer } from "electron";

const services = {
    chat: {
        generateWordExplanation: async (queriedSentence, queriedWord) => {
            return await ipcRenderer.invoke("chat:generateWordExplanation", {
                queriedSentence,
                queriedWord,
            });
        },
        // 添加获取AI提供商列表的方法
        getProviders: async () => {
            return await ipcRenderer.invoke("chat:getProviders");
        },
        // 添加获取特定提供商模型列表的方法
        getModelsForProvider: async (provider) => {
            return await ipcRenderer.invoke(
                "chat:getModelsForProvider",
                provider,
            );
        },
        // 获取当前Chat设置
        getChatSettings: async () => {
            return await ipcRenderer.invoke("chat:getChatSettings");
        },
        // 更新AI提供商
        updateProvider: async (provider) => {
            return await ipcRenderer.invoke("chat:updateProvider", provider);
        },
        // 更新API密钥
        updateApiKey: async (provider, apiKey) => {
            return await ipcRenderer.invoke("chat:updateApiKey", {
                provider,
                apiKey,
            });
        },
        // 更新选定的模型
        updateSelectedModel: async (provider, modelId) => {
            return await ipcRenderer.invoke("chat:updateSelectedModel", {
                provider,
                modelId,
            });
        },
        // 测试API连接
        testConnection: async (provider, apiKey, model) => {
            return await ipcRenderer.invoke("chat:testConnection", {
                provider,
                apiKey,
                model,
            });
        },
    },
    anki: {
        addNoteToAnki: async (fields) => {
            return await ipcRenderer.invoke("anki:addNoteToAnki", fields);
        },
        checkAnkiHealth: async () => {
            return await ipcRenderer.invoke("anki:checkHealth");
        },
        // ===== Settings =====
        getAnkiSettings: async () => {
            return await ipcRenderer.invoke("anki:getAnkiSettings");
        },
        setAnkiSettings: async () => {
            return await ipcRenderer.send("anki:getAnkiSettings", settings);
        },
    },
};

const electronAPI = {
    openSettings: () => ipcRenderer.send("show-settings"),
    saveSettings: (settings) => ipcRenderer.invoke("save-settings", settings),
    getSettings: async () => await ipcRenderer.invoke("get-settings"),
    getClipboardText: () => ipcRenderer.invoke("main:getClipboardText"),
};

contextBridge.exposeInMainWorld("services", services);
contextBridge.exposeInMainWorld("electronAPI", electronAPI);
