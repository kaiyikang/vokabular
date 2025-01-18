const { contextBridge } = require('electron');
const { generateChatResponse } = require('./api/chatService');

contextBridge.exposeInMainWorld('api', {
    generateChatResponse: async (queriedSentence, queriedWord) => {
        return await generateChatResponse(queriedSentence, queriedWord);
    },
});