const {ipcMain} = require('electron')
const robot = require('robotjs')
const vkey = require('vkey')

function handleMouse(data) {
    let {clientX, clientY, screen, video} = data
    // clientX 是在 控制端上标准距离，video 是傀儡端传给控制端的 screen 是傀儡端的 screen
    let x = clientX * screen.width / video.width
    let y = clientY * screen.height / video.height
    console.log(x, y)
    robot.moveMouse(x, y)
    robot.mouseClick()
}

function handleKey(data) {
    // data {keyCode, meta, alt, ctrl, shift}
    const modifiers = []
    if(data.meta) modifiers.push('meta')
    if(data.shift) modifiers.push('shift')
    if(data.alt) modifiers.push('alt')
    if(data.ctrl) modifiers.push('ctrl')
    let key = vkey[data.keyCode].toLowerCase()
    try {
        if(key[0] !== '<') { //<shift>
            robot.keyTap(key, modifiers)
        }
    }catch (e) {
        console.log("-> 键盘事件有问题", e);

    }

}

module.exports = function() {
    ipcMain.on('robot', (e, type, data) => {
        console.log('handle', type, data)
        if(type === 'mouse') {
            handleMouse(data)
        } else if(type === 'key') {
            handleKey(data)
        }
    })
}
