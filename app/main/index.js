const {app, BrowserWindow} = require('electron')
const path = require('path')
const handleIPC = require('./ipc')
const {create: createMainWindow, show: showMainWindow, close: closeMainWindow} = require('./windows/main')
const {create: createControlWindow} = require('./windows/control')
// const gotTheLock = app.requestSingleInstanceLock()
// if(!gotTheLock) {
//     app.quit()
// } else {
//     app.on('second-instance', () => {
//         showMainWindow()
//     })
    app.on('ready', () => {
        createControlWindow()
        // createMainWindow()
        handleIPC()
        // require('./trayAndMenu')
        require('./robot.js')()
    })
//     app.on('before-quit', () => {
//         closeMainWindow()
//     })
//     app.on('activate', () => {
//         showMainWindow()
//     })
// }




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
