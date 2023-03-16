import EventEmitter from 'events'
import {ipcRenderer} from 'electron'

const remote = window.require('@electron/remote')
const {desktopCapturer} = remote
let peer = new EventEmitter()
window.peer = peer // 为了直接模拟过程，信令结束后，会删掉
ipcRenderer.on('offer', (e, offer) => {
    console.log('init pc', offer)
    const pc = new window.RTCPeerConnection();

    pc.ondatachannel = (e) => {
        console.log('data', e)
        e.channel.onmessage = (e) => {
            console.log('onmessage', e, JSON.parse(e.data))
            let {type, data} = JSON.parse(e.data)
            console.log('robot', type, data)
            if (type === 'mouse') {
                data.screen = {
                    width: window.screen.width,
                    height: window.screen.height
                }
            }
            ipcRenderer.send('robot', type, data)
        }
    }

    async function getScreenStream() {
        const sources = await desktopCapturer.getSources({types: ['window', 'screen']})
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sources[0].id,
                        maxWidth: window.screen.width,
                        maxHeight: window.screen.height
                    }
                }
            }).then(stream => resolve(stream))
                .catch(err => {
                    console.log("-> err", err);
                    reject(err)
                })

        })
    }

    pc.onicecandidate = (e) => {
        // 告知其他人
        if (e.candidate) {
            ipcRenderer.send('forward', 'puppet-candidate',  JSON.stringify(e.candidate))
            console.log("-> e.candidate", JSON.stringify(e.candidate));
        }
    }

    ipcRenderer.on('candidate', (e, candidate) => {
        addIceCandidate(JSON.parse(candidate))
    })


    async function addIceCandidate(candidate) {
        if (!candidate) return
        await pc.addIceCandidate(new RTCIceCandidate(candidate))
    }


    async function createAnswer(offer) {
        let stream = await getScreenStream()
        pc.addStream(stream)
        await pc.setRemoteDescription(offer);
        await pc.setLocalDescription(await pc.createAnswer());
        console.log('create answer \n', JSON.stringify(pc.localDescription))
        // send answer
        return pc.localDescription
    }


    createAnswer(offer).then((answer) => {
        ipcRenderer.send('forward', 'answer', {type: answer.type, sdp: answer.sdp})
    })

})
export default peer
