const {app, BrowserWindow} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const handleIPC = require('./ipc')
const {create: createMainWindow, show: showMainWindow, close: closeMainWindow} = require('./windows/main')
const {create: createControlWindow} = require('./windows/control')
// const gotTheLock = true // 是不是有别的进程
const gotTheLock = app.requestSingleInstanceLock() // 是不是有别的进程
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', () => {
        showMainWindow()
    })
    app.on('will-finish-launching', () => {
        if(!isDev) {
            // 暂时隐藏，需要证书
            //require('./updater.js')
        }
        require('./crash-reporter').init()
    })

    app.on('ready', () => {
        createMainWindow()
        handleIPC()
        require('./trayAndMenu')
        require('./robot.js')()
    })
    app.on('before-quit', () => {
        closeMainWindow()
    })
    app.on('activate', () => {
        showMainWindow()
    })
}


// app.on('ready',()=>{
//     const win = new BrowserWindow({
//         width:600,
//         height:400,
//         webPreferences:{
//             nodeIntegration:true,
//             contextIsolation:false
//         }
//     })
//
//     win.loadURL('http://localhost:3000')
//
//     handleIPC()
//
//
// })
