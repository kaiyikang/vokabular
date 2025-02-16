const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            sandbox: false,
            preload: path.join(__dirname, "../preload/preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // 更新加载路径
    if (process.env.NODE_ENV === "development") {
        // 开发模式下使用 Vite 开发服务器
        win.loadURL("http://localhost:5173/pages/index/index.html");
    } else {
        // 生产模式下加载打包后的文件
        win.loadFile(
            path.join(__dirname, "../renderer/pages/index/index.html")
        );
    }

    // 监听渲染进程的控制台消息
    win.webContents.on("console-message", (event, level, message) => {
        console.log(`[Renderer] ${level}: ${message}`);
    });
}

ipcMain.on("show-settings", () => {
    const newWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            sandbox: false,
            preload: path.join(__dirname, "../preload/preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // 更新加载路径
    if (process.env.NODE_ENV === "development") {
        // 开发模式下使用 Vite 开发服务器
        newWindow.loadURL("http://localhost:5173/pages/settings/settings.html");
    } else {
        // 生产模式下加载打包后的文件
        newWindow.loadFile(
            path.join(__dirname, "../renderer/pages/settings/settings.html")
        );
    }
});

function getConfig() {
    const configPath = path.join(app.getAppPath(), "src/main", "config.json");
    try {
        const configData = fs.readFileSync(configPath, "utf-8");
        return JSON.parse(configData);
    } catch (error) {
        console.error("Error reading or parsing config.json", error);
        return {};
    }
    return configPath;
}

app.whenReady().then(() => {
    createWindow();
    const config = getConfig();
    console.log("Loaded config:", config);

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    // 在 macOS 上，应用程序通常不会退出，除非用户强制退出
    if (process.platform !== "darwin") {
        app.quit();
    }
});
