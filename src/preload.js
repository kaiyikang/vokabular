const { contextBridge, ipcRenderer } = require('electron');
const { generateChatResponse } = require('./api/chatService');

contextBridge.exposeInMainWorld('api', {
    generateChatResponse: async (queriedSentence) => {
        return await generateChatResponse(queriedSentence);
    }
});