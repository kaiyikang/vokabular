const { contextBridge } = require("electron");
const { generateWordExplanation } = require("./services/chatService");

contextBridge.exposeInMainWorld("api", {
    generateWordExplanation: async (queriedSentence, queriedWord) => {
        return await generateWordExplanation(queriedSentence, queriedWord);
    },
});
