const { contextBridge, ipcRenderer } = require("electron");
const { generateWordExplanation } = require("./services/chatService");
const { addNoteToAnki } = require("./services/ankiService");

const services = {
    chat: {
        generateWordExplanation: async (queriedSentence, queriedWord) => {
            return await generateWordExplanation(queriedSentence, queriedWord);
        },
    },
    anki: {
        addNoteToAnki: async (fields) => {
            return await addNoteToAnki(fields);
        },
    },
};

const electronAPI = {
    openSettings: () => ipcRenderer.send("show-settings"),
};

contextBridge.exposeInMainWorld("services", services);
contextBridge.exposeInMainWorld("electronAPI", electronAPI);
