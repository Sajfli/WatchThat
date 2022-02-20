import { useState, useEffect, useRef } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import Input from 'components/atoms/Input/Input'
import useAuth from 'hooks/useAuth'
import useSocket from 'hooks/useSocket'

import getRandom from 'utils/getRandom'

import style from './RoomChat.module.scss'
import usePorter from 'hooks/usePorter'
import useLocalisation from 'hooks/useLocalisation'

const RoomChat = ({ username }) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [localMessages, setLocalMessages] = useState([])

    const [msgTimeout, setMsgTimeout] = useState(false)

    const auth = useAuth()
    const [socket] = useSocket()

    const mounted = useRef(false)
    const messagesEnd = useRef(null)

    const l = useLocalisation()
    const porter = usePorter()

    useEffect(() => {
        mounted.current = true

        return () => {
            mounted.current = false
        }
    }, [])

    useEffect(() => {
        porter.addFunction('chat_notify', notify)
        console.log(messages)

        return () => {
            porter.removeFunction('chat_notify')
        }
    }, [messages])

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
        const msgId = getRandom()

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

            const index = _local.findIndex(({ msgId: id }) => id === msgId)

            if (index < 0) return

            const msg = _local[index]
            msg.local = false

            _local.splice(index, 1)

            setLocalMessages(_local)
            setMessages([...messages, msg])
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

            setMessages([...messages, msg])
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

    // const addChatMessage = ()

    const notify = (action, { ...params }) => {
        const msg = {}
        msg.msgId = getRandom(36)
        msg.type = 'notify'

        switch (action) {
            case 'user_joined':
                msg.notifyType = 'userJoined'
                msg.notifyValue = params.username

                break
            case 'user_leaved':
                msg.notifyType = 'userLeaved'
                msg.notifyValue = params.username

                break
            default:
                break
        }

        // TODO: fix race condition
        // if (msg.notifyType) setMessages([...messages, msg])
    }

    return (
        <div className={style.chat}>
            <div className={style.output}>
                {[...messages, ...localMessages].map(
                    ({
                        username,
                        content,
                        local,
                        msgId,
                        type,
                        notifyType,
                        notifyValue,
                    }) => (
                        <div
                            className={classnames(
                                style.message,
                                local && style.local
                            )}
                            key={msgId}
                        >
                            {type !== 'notify' ? (
                                <>
                                    <span className={style.sender}>
                                        {username}:
                                    </span>
                                    <span className={style.content}>
                                        {content}
                                    </span>
                                </>
                            ) : (
                                <span className={style.notify}>
                                    <span className={style.notifyValue}>
                                        {notifyValue}&nbsp;
                                    </span>
                                    {l(notifyType)}
                                </span>
                            )}
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
