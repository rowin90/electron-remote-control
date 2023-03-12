const EventEmitter = require('events')
const peer = new EventEmitter()
const {ipcRenderer} = require('electron')
const remote = window.require('@electron/remote')

const {desktopCapturer} = remote
const pc = new window.RTCPeerConnection({})
let dc = pc.createDataChannel('robotchannel', {reliable: false});
console.log('before-opened', dc)
dc.onopen = function() {
    console.log('opened')
    peer.on('robot', (type, data) => {
        dc.send(JSON.stringify({type, data}))
    })
}
dc.onmessage = function(event) {
    console.log('message', event)
}
dc.onerror = (e) => {console.log(e)}
//
// async function getScreenStream() {
//     const sources = await desktopCapturer.getSources({types: ['window', 'screen']})
//     console.log("-> sources", sources);
//
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//             audio: false,
//             video: {
//                 mandatory: {
//                     chromeMediaSource: 'desktop',
//                     chromeMediaSourceId: sources[0].id,
//                     maxWidth: window.screen.width,
//                     maxHeight: window.screen.height
//                 }
//             }
//         })
//         console.log("-> stream", stream);
//         peer.emit('add-stream', stream)
//
//     } catch (e) {
//         console.log("-> e", e);
//
//     }
// }
//
// getScreenStream()

async function createOffer() {
    let offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true
    })
    await pc.setLocalDescription(offer)
    console.log('create-offer\n', JSON.stringify(pc.localDescription))
    return pc.localDescription
}

createOffer().then((offer) => {
    console.log('forward', 'offer', offer)
    ipcRenderer.send('forward', 'offer', {type: offer.type, sdp: offer.sdp})
})


ipcRenderer.on('answer', (e, answer) => {
    setRemote(answer).catch(e => {

    console.log("-> 设置错误e", e);
    })
})

ipcRenderer.on('candidate', (e, candidate) => {
    // TODO 1 加了 json.stringify
    addIceCandidate(JSON.parse(candidate))
})


async function setRemote(answer) {
    console.log("-> answer111111", answer);
    await pc.setRemoteDescription(answer)
    console.log('create-answer', pc)
}

pc.onicecandidate = (e) => {
    if (e.candidate) {
        console.log('candidate', JSON.stringify(e.candidate))
        // TODO 1 加了一个  JSON.stringify
        ipcRenderer.send('forward', 'control-candidate', JSON.stringify(e.candidate))
        // 告知其他人
    }
}
let candidates = []

async function addIceCandidate(candidate) {
    if (!candidate || !candidate.type) return
    candidates.push(candidate)
    if (pc.remoteDescription && pc.remoteDescription.type) {
        for (let i = 0; i < candidates.length; i++) {
            await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
        }
        candidates = []
    }
}


pc.onaddstream = (e) => {
    console.log('addstream', e)
    peer.emit('add-stream', e.stream)

}
// peer.on('robot', (type, data) => {
//     console.log('robot', type, data)
//     if(type === 'mouse') {
//         data.screen = {
//             width: window.screen.width,
//             height: window.screen.height
//         }
//     }
//     setTimeout(() => {
//     ipcRenderer.send('robot', type, data)
//     }, 2000)
//
// })

module.exports = peer
