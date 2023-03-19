# 业务
1. 项目分为两段，傀儡端 和 控制端
2. 项目启动后，会请求信令服务，生成通信码，下发到对应的端中，作为此次链接的标示；当一端输入对方的通信码，即可以控制对方的电脑屏幕；当前电脑为“控制端”，被控制的叫“傀儡端”

# 技术说明
- 该项目使用 electron + WebRTC ，P2P链接，信令服务，robotjs自动控制完成远程控制
- 启动依赖 
    - 信令服务 [electron-remote-control-server](https://github.com/rowin90/electron-remote-control-server)
    - 自动更新服务（未完成，后面补充）

# 本地开发
1. 需要启动 start:render 执行 view 端的实时编译，用的是cra
2. 需要在 electron-remote-control-server 中启动 ws 信令服务，作为通信
3. 需要本地启动两个窗口（模拟控制端和傀儡断），执行两次 start:main
   1. 最好是注释 const gotTheLock = app.requestSingleInstanceLock() 这个逻辑，这个是为生产环境中，不能同时启动两个端做的优化，本地调试时允许启动多个实例

# 项目目录
```html
├── app  // 主入口
│   ├── main
│   │   ├── crash-reporter.js
│   │   ├── index.js
│   │   ├── ipc.js  // ipc通信
│   │   ├── robot.js
│   │   ├── signal.js // 信令通信
│   │   ├── trayAndMenu  // 托盘
│   │   │   ├── darwin.js
│   │   │   ├── icon_darwin.png
│   │   │   ├── icon_darwin@2x.png
│   │   │   ├── icon_win32.png
│   │   │   ├── icon_win32@2x.png
│   │   │   ├── index.js
│   │   │   └── win32.js
│   │   ├── updater.js
│   │   └── windows  // 窗口
│   │       ├── about.js  // 关于窗口
│   │       ├── control.js // 控制窗口
│   │       ├── icon.png
│   │       └── main.js  // 傀儡窗口
│   └── renderer   // view
│       ├── pages
│       │   ├── control   // 控制端 view
│       │   │   ├── app.js
│       │   │   ├── index.html
│       │   │   └── peer-control.js  // 控制端主逻辑
│       │   └── main  // 打包后的产物，忽略！
│       │       ├── asset-manifest.json
│       │       ├── favicon.ico
│       │       ├── index.html
│       │       ├── logo192.png
│       │       ├── logo512.png
│       │       ├── manifest.json
│       │       ├── robots.txt
│       │       └── static
│       └── src   // 傀儡端代码，用的cra
│           └── main
│               ├── README.md
│               ├── build.js
│               ├── config-overrides.js
│               ├── package-lock.json
│               ├── package.json
│               ├── pnpm-lock.yaml
│               ├── public
│               └── src  // 傀儡端主逻辑
├── build  // 打包后的
│   └── config.gypi
├── package.json
├── pnpm-lock.yaml
├── resources   // 打包需要的资源
│   ├── background.png
│   ├── background@2x.png
│   ├── icon.icns
│   ├── icon.ico
│   └── icon.png
└── robot_test.js
```
