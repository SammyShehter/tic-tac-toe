import {
    ConnectedSocket,
    OnConnect,
    SocketController,
    SocketIO,
} from 'socket-controllers'
import { Socket, Server } from 'socket.io'
import debug from 'debug'

const log: debug.IDebugger = debug('app:main-controller')

@SocketController()
export class MainController {
    @OnConnect()
    public onConnection(
        @ConnectedSocket() socket: Socket,
        @SocketIO() io: Server
    ) {
        log(`New Socket connected: ${socket.id}`)
    }
}
