const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  win.loadFile('public/index.html');

  // 监听渲染进程的控制台消息
  win.webContents.on('console-message', (event, level, message) => {
    console.log(`[Renderer] ${level}: ${message}`);
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // 在 macOS 上，应用程序通常不会退出，除非用户强制退出
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

