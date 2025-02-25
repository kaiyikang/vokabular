import { contextBridge, ipcRenderer } from "electron";

const services = {
    chat: {
        generateWordExplanation: async (queriedSentence, queriedWord) => {
            return await ipcRenderer.invoke("chat:generateWordExplanation", {
                queriedSentence,
                queriedWord,
            });
            // return await generateWordExplanation(queriedSentence, queriedWord);
        },
    },
    anki: {
        addNoteToAnki: async (fields) => {
            return await ipcRenderer.invoke("anki:addNoteToAnki", fields);
            // return await addNoteToAnki(fields);
        },
        checkAnkiHealth: async () => {
            return await ipcRenderer.invoke("anki:checkHealth");
            // return await checkAnkiHealth();
        },
    },
};

const electronAPI = {
    openSettings: () => ipcRenderer.send("show-settings"),
};

contextBridge.exposeInMainWorld("services", services);
contextBridge.exposeInMainWorld("electronAPI", electronAPI);
