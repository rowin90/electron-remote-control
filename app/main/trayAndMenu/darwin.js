const {app, Menu, Tray} = require('electron')
const {show: showMainWindow} = require('../windows/main')
const {create: createAboutWindow} = require('../windows/about')
const path = require('path')

let tray
function setTray() {
    tray  = new Tray(path.resolve(__dirname, './icon_darwin.png'))
    tray.on('click', () => {
        showMainWindow()
    })
    tray.on('right-click', () => {
        const contextMenu = Menu.buildFromTemplate([
            {label: '显示', click: showMainWindow},
            {label: '退出', click: app.quit}
        ])
        tray.popUpContextMenu(contextMenu)
    })
}

function setAppMenu() {
    let appMenu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    label: '关于',
                    click: createAboutWindow
                },
                { type: 'separator'  },
                { role: 'services'  },
                { type: 'separator'  },
                { role: 'hide'  },
                { role: 'hideothers'  },
                { role: 'unhide'  },
                { type: 'separator'  },
                { role: 'quit'  }
            ],

        },
		{ role: 'fileMenu' },
		{ role: 'windowMenu' },
		{ role: 'editMenu' },
        {
            label: '视图',
            submenu: [
                {
                    label: '刷新当前页面',
                    accelerator: 'CmdOrCtrl+R',
                    click: (item, focusedWindow) => {
                        if (focusedWindow)
                            focusedWindow.reload();
                    }
                },
                {
                    label: '切换全屏幕',
                    accelerator: (() => {
                        if (process.platform === 'darwin')
                            return 'Ctrl+Command+F';
                        else
                            return 'F11';
                    })(),
                    click: (item, focusedWindow) => {
                        if (focusedWindow)
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    }
                },
                {
                    label: '切换开发者工具',
                    accelerator: (function() {
                        if (process.platform === 'darwin')
                            return 'Alt+Command+I';
                        else
                            return 'Ctrl+Shift+I';
                    })(),
                    click: (item, focusedWindow) => {
                        if (focusedWindow)
                            focusedWindow.toggleDevTools();
                    }
                },
            ]
        },
    ]);
    app.applicationMenu = appMenu
}

app.whenReady().then(() => {
    setTray()
    setAppMenu()
})
