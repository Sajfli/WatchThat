import { useState, useEffect, useRef } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import Input from 'components/atoms/Input/Input'
import useAuth from 'hooks/useAuth'
import useSocket from 'hooks/useSocket'

import style from './RoomChat.module.scss'

const RoomChat = ({ username }) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [localMessages, setLocalMessages] = useState([])

    const [msgTimeout, setMsgTimeout] = useState(false)

    const auth = useAuth()
    const [socket] = useSocket()

    const mounted = useRef(false)
    const messagesEnd = useRef(null)

    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (msgTimeout) return

        setTimeout(() => {
            if (mounted.current) setMsgTimeout(false)
        }, 200)
        setMsgTimeout(true)

        // validate message and socket
        if (!message || message.length < 1 || !socket) return

        let content = message.trim()
        if (content.length < 1) return

        // generate message id
        const randomBuffer = new Uint32Array(1)
        window.crypto.getRandomValues(randomBuffer)

        const msgId =
            Date.now() +
            `${randomBuffer[0]}` +
            Math.random().toString(16).slice(2)

        // create msg object
        const messageObject = {
            content,
            socketId: socket.id,
            _id: auth.user ? auth.user._id : null,
            username,
            msgId,
        }

        socket.emit('new message', messageObject)

        // send message
        const _messages = [...localMessages]
        _messages.push({ ...messageObject, local: true })

        setLocalMessages(_messages)
        setMessage('')
    }

    useEffect(() => {
        if (!socket) return

        socket.on('message sent', (msgId) => {
            const _local = [...localMessages]
            const _global = [...messages]

            const index = _local.findIndex(({ msgId: id }) => id === msgId)

            if (index < 0) return

            const msg = _local[index]
            msg.local = false

            _local.splice(index, 1)
            _global.push(msg)

            setLocalMessages(_local)
            setMessages(_global)
        })

        socket.on('message received', (msg) => {
            if (
                !msg.msgId ||
                !msg.content ||
                !msg.username ||
                msg.content.trim().length < 1
            )
                return

            msg.content = msg.content.trim()

            const _messages = [...messages]
            _messages.push(msg)

            setMessages(_messages)
        })

        return () => {
            socket.off('message sent')
            socket.off('message received')
        }
    }, [socket, localMessages, messages])

    useEffect(() => {
        if (!messagesEnd.current) return

        messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
    }, [messages, localMessages])

    return (
        <div className={style.chat}>
            <div className={style.output}>
                {[...messages, ...localMessages].map(
                    ({ username, content, local, msgId }) => (
                        <div
                            className={classnames(
                                style.message,
                                local && style.local
                            )}
                            key={msgId}
                        >
                            <span className={style.sender}>{username}:</span>
                            <span className={style.content}>{content}</span>
                        </div>
                    )
                )}
                <div ref={messagesEnd}></div>
            </div>
            <div className={style.input}>
                <form onSubmit={handleSubmit}>
                    <Input
                        className={style.textBox}
                        height={0}
                        value={message}
                        onChange={({ target: { value } }) => setMessage(value)}
                        inputClassName={style.textBoxInput}
                    />
                    <button className={style.btn} type="submit">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </form>
            </div>
        </div>
    )
}

RoomChat.propTypes = {
    username: PropTypes.string.isRequired,
}

export default RoomChat
