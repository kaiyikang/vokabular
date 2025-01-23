const { contextBridge, ipcRenderer } = require("electron");
const { generateWordExplanation } = require("./services/chatService");
const { AnkiClient } = require("./services/ankiClient");



const services = {
    chat: {generateWordExplanation: async (queriedSentence, queriedWord) => {
        return await generateWordExplanation(queriedSentence, queriedWord);
    }},
    anki: {
        getDeckNames: async () => {
            return await AnkiClient.getDeckNames();
        },
        
    }
}

const electronAPI = {
    openSettings: () => ipcRenderer.send('show-settings')
}

contextBridge.exposeInMainWorld("services", services);
contextBridge.exposeInMainWorld("electronAPI", electronAPI);