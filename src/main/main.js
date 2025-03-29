import { app, BrowserWindow, ipcMain, clipboard } from "electron";
import config from "../config/configSchema";
import { createChatService } from "../services/chatService";
import { createAnkiService } from "../services/ankiService";
import { createSettingService } from "../services/settingsService";
import { createWindow } from "./windowManager";

// config.clear();
const chatService = createChatService(config);
const ankiService = createAnkiService(config);
const settingsService = createSettingService(config);

app.whenReady().then(() => {
    mainWindow();
    registerIpcHandlers();
    // for Unix
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            mainWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

function registerIpcHandlers() {
    // single method register
    createIpcHandler("main:getClipboardText", () => clipboard.readText());
    ipcMain.on("settings:open", settingWindow);

    // Multiple methods register
    registerServiceMethods("chat", chatService, [
        "generateWordExplanation",
        "getProviders",
        "testConnection",
        "getModelsByProvider",
    ]);
    registerServiceMethods("anki", ankiService, [
        "checkHealth",
        "addNoteToAnki",
    ]);
    registerServiceMethods("settings", settingsService, [
        "save",
        "loadApiKeyByProvider",
        "loadDefaultProvider",
        "loadDefaultModelByProvider",
    ]);
}

function registerServiceMethods(serviceName, service, methodNames) {
    methodNames.forEach((methodName) => {
        const channelName = `${serviceName}:${methodName}`;
        createIpcHandler(channelName, (...args) =>
            service[methodName](...args),
        );
    });
}

function createIpcHandler(name, handler) {
    ipcMain.handle(name, async (event, ...args) => {
        try {
            return await handler(...args);
        } catch (error) {
            console.error(`Error in ${name}:`, error);
            throw error;
        }
    });
}

function mainWindow() {
    return createWindow(
        "main",
        { width: 400, height: 660 },
        "index/index.html",
    );
}

function settingWindow() {
    return createWindow(
        "setting",
        { width: 600, height: 400 },
        "settings/settings.html",
    );
}
