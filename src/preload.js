const { contextBridge } = require("electron");
const { generateWordExplanation } = require("./api/chatService");

contextBridge.exposeInMainWorld("api", {
    generateWordExplanation: async (queriedSentence, queriedWord) => {
        return await generateWordExplanation(queriedSentence, queriedWord);
    },
});
