import socketio from 'socket.io-client'
import config from '@/config/app'
import React, { useContext, useState } from 'react'

const SocketContext = React.createContext()

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)

    const [userId, setUserId] = useState(null)

    const initSocket = (auth) => {
        const options = {
            path: config.SOCKET_PATH,
            autoConnect: true,
        }

        if (auth.user) {
            const token = localStorage.getItem('token')
            if (!token) {
                setUserId(null)
            } else {
                options.auth = {
                    token,
                }

                setUserId(auth.user._id)
            }
        }

        const conn = socketio.connect(config.SOCKET_URL, options)

        setSocket(conn)
    }

    return (
        <SocketContext.Provider value={{ socket, userId, initSocket }}>
            {children}
        </SocketContext.Provider>
    )
}

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

const useSocket = () => {
    const { socket, userId, initSocket } = useContext(SocketContext)

    return [socket, userId, initSocket]
}

export { SocketProvider }
export default useSocket
