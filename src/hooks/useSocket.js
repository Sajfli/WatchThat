import socketio from 'socket.io-client'
import { SOCKET_URL, SOCKET_PATH } from 'config/app'
import React, { useContext, useState } from 'react'

const SocketContext = React.createContext()

// const socket = socketio.connect(SOCKET_URL, { path: SOCKET_PATH, autoConnect: true })

const SocketProvider = ({children}) => {

    const [ socket, setSocket ] = useState(null)

    const [ userId, setUserId ] = useState(null)

    const initSocket = (auth) => {

        const options = {
            path: SOCKET_PATH,
            autoConnect: true,
        }

        if(!!auth.user) {

            const token = localStorage.getItem('token')
            if(!token) {
                setUserId(null)
            } else {
                options.auth = {
                    token
                }

                setUserId(auth.user._id)
            }
        }

        const conn = socketio.connect(SOCKET_URL, options)

        setSocket(conn)
    }

    return(
        <SocketContext.Provider value={{socket, userId, initSocket}}>
            {children}
        </SocketContext.Provider>
    )

}

const useSocket = () => {
    const {socket, userId, initSocket} = useContext(SocketContext)

    return [socket, userId, initSocket]
}

export { SocketProvider }
export default useSocket