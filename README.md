以下是创建 Electron.js 应用的基本步骤：

1. 首先确保安装了 Node.js，然后创建一个新的项目目录：

```bash
mkdir my-electron-app
cd my-electron-app
```

2. 初始化项目：

```bash
npm init -y
```

3. 安装 Electron：

```bash
npm install electron --save-dev
```

4. 创建基本文件结构：

```
my-electron-app/
├── package.json
├── main.js
├── index.html
└── renderer.js
```

5. 修改 package.json：

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  }
}
```

6. 创建主进程文件 (main.js)：

```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')
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
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

7. 创建 HTML 文件 (index.html)：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hello Electron!</title>
</head>
<body>
    <h1>Hello Electron!</h1>
    <script src="renderer.js"></script>
</body>
</html>
```

8. 创建渲染进程文件 (renderer.js)：

```javascript
// 这里可以写渲染进程的代码
console.log('Hello from renderer process!')
```

9. 运行应用：

```bash
npm start
```

进阶建议：

1. 使用打包工具：
```bash
npm install electron-builder --save-dev
```

2. 添加热重载（开发时使用）：
```bash
npm install electron-reloader --save-dev
```

3. 使用框架：
可以集成 Vue.js 或 React 等前端框架：
- electron-vue
- electron-react-boilerplate

4. 安全配置：
建议启用 contextIsolation 并使用 preload 脚本：

```javascript
// main.js
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js')
  }
})
```

5. 添加开发工具：
```bash
npm install electron-devtools-installer --save-dev
```

示例项目结构（进阶）：

```
my-electron-app/
├── src/
│   ├── main/
│   │   └── main.js
│   ├── renderer/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── preload/
│       └── preload.js
├── assets/
├── build/
├── package.json
└── package-lock.json
```

这是一个基本的 Electron.js 应用程序结构。你可以根据需要添加更多功能和配置。

常用功能示例：

1. 系统托盘：
```javascript
const { Tray, Menu } = require('electron')

function createTray() {
  const tray = new Tray('icon.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => win.show() },
    { label: 'Quit', click: () => app.quit() }
  ])
  tray.setContextMenu(contextMenu)
}
```

2. 主进程和渲染进程通信：
```javascript
// 主进程
ipcMain.on('message', (event, arg) => {
  console.log(arg)
  event.reply('reply', 'message received')
})

// 渲染进程
ipcRenderer.send('message', 'hello from renderer')
ipcRenderer.on('reply', (event, arg) => {
  console.log(arg)
})
```
