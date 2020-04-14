import * as SocketIO from 'socket.io-client'
import config from '../config'
import { createGlobalState } from 'react-use'

const useSocketGlobal = createGlobalState<SocketIOClient.Socket>(SocketIO.connect(config.apiHost))

export default function useSocket(): SocketIOClient.Socket {
    const [ socket ] = useSocketGlobal()
    return socket!
}