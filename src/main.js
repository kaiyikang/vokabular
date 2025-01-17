const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  // 创建一个窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // 加载 index.html
  win.loadFile('public/index.html');

  win.webContents.on('console-message', (event, level, message) => {
    console.log(`[Renderer] ${level}: ${message}`);
  });
}

app.whenReady().then(() => {
  // 创建窗口
  createWindow()

  // 当所有窗口都关闭时，退出应用程序
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // 当所有窗口都关闭时，退出应用程序
  // 在 macOS 上，应用程序通常不会退出，除非用户强制退出
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

