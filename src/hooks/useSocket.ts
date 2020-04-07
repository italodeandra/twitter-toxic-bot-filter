import * as SocketIO from 'socket.io-client'

let socket: SocketIOClient.Socket

export default function useSocket() {
    if (!socket) socket = SocketIO.connect('ws://localhost:3001')

    return socket
}