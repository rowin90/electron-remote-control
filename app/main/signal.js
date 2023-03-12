const WebSocket = require('ws');
const EventEmitter = require('events');
const signal = new EventEmitter();

const ws = new WebSocket('ws://127.0.0.1:8010');

ws.on('open', function open() {
    console.log('connect success')
})

ws.on('message', function incoming(message) {
    let data = JSON.parse(message)
    console.log('data2222', data, message.toString());
    signal.emit(data.event, data.data)
})


function send(event, data) {
    console.log('sended', JSON.stringify({event, data}))
    ws.send(JSON.stringify({event, data}))
}

function invoke(event, data, answerEvent) {
    // event = 'login'  data = null
    return new Promise((resolve, reject) => {
        send(event, data)
        // answerEvent  = 'logined '
        signal.once(answerEvent, resolve)
        setTimeout(() => {
            reject('timeout')
        }, 5000)
    })
}
signal.send = send
signal.invoke = invoke

module.exports = signal
