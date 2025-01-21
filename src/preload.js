const { contextBridge } = require("electron");
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

contextBridge.exposeInMainWorld("services", services);