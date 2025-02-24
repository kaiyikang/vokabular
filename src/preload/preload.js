import { contextBridge, ipcRenderer } from "electron";
import { generateWordExplanation } from "../services/chatService";
import { addNoteToAnki, checkAnkiHealth } from "../services/ankiService";

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
        checkAnkiHealth: async () => {
            return await checkAnkiHealth();
        },
    },
};

const electronAPI = {
    openSettings: () => ipcRenderer.send("show-settings"),
};

contextBridge.exposeInMainWorld("services", services);
contextBridge.exposeInMainWorld("electronAPI", electronAPI);
