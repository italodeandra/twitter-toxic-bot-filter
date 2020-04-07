import * as SocketIO from 'socket.io-client'
import config from '../config'

let socket: SocketIOClient.Socket

export default function useSocket() {
    if (!socket) socket = SocketIO.connect(config.apiHost)

    return socket
}