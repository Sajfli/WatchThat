import React from 'react'
import socketio from 'socket.io-client';
import { SOCKET_URL, SOCKET_PATH } from 'config/app';

const socket = socketio.connect(SOCKET_URL, { path: SOCKET_PATH })

const SocketContext = React.createContext()

function withSocket (Children) {
    return ({...props}) => (
        <SocketContext.Provider value={socket}>
            <Children {...props} />
        </SocketContext.Provider>
    )
}

export { socket, SocketContext, withSocket }