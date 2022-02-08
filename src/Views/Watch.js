import { useState, useRef, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'
import ky from 'ky'
import URL from 'url-parse'
import classnames from 'classnames'


import useSocket from 'hooks/useSocket'

// utils
import isURL from 'validator/lib/isURL'

// hooks
import useLocalisation from 'hooks/useLocalisation'
import useModal from 'hooks/useModal'
import useAuthModal from 'hooks/useAuthModal'
import useError from 'hooks/useError'
import useAuth from 'hooks/useAuth'

// UI components
import Player from 'components/organisms/Player/Player'
import TextInput from 'components/atoms/Input/Input'
import ChooseUsername from 'components/organisms/Modals/ChooseUsername'
import RoomControls from 'components/organisms/RoomControls/RoomControls'
import RoomMembers from 'components/organisms/RoomMembers/RoomMembers'

// style
import style from './Watch.module.scss'


const Watch = () => {

    const l = useLocalisation()
    const playerContainer = useRef(null)

    const history = useHistory()
    const params = useParams()

    const usernameModal = useModal()
    const [ isAuthModalOpen ] = useAuthModal()

    const [ socket, socketUserId, initSocket ] = useSocket()

    const auth = useAuth()

    const handleError = useError()

    // video data
    const [ video, setVideo ] = useState({})
    const [ currentRoom, setCurrentRoom ] = useState(null)

    // text input value
    const [ search, setSearch ] = useState('')

    const username = auth.user ? auth.user.username : localStorage.getItem('tempUsername')

    // handle unmount
    useEffect(() => {
        return () => {
            if(!!socket)
                socket.emit('room_leave')
        }
    }, [socket])

    // init socket
    useEffect(() => {
        if(
            !!socket &&
            (
                (
                    auth.user && (socketUserId === auth.user._id)
                ) ||
                (
                    !auth.user && !socketUserId
                )
            )
        ) return

        initSocket(auth)

    }, [socket, auth, socketUserId]) // eslint-disable-line

    // check for param and username
    useEffect(() => {
        if(!params.id) history.push('/')
        if(!username && (!usernameModal.isOpen && !isAuthModalOpen)) {
            usernameModal.handleOpenModal()
            if(!!currentRoom && currentRoom.length > 0) {
                setCurrentRoom(null)
                if(!!socket)
                    socket.emit('room_leave')
            }
        }

    }, [params.id, username, usernameModal.isOpen, isAuthModalOpen]) // eslint-disable-line

    // join room
    useEffect(() => {
        if(currentRoom === params.id || !socket || !params.id || !username) return

        // console.log(params.id, currentRoom)

        setCurrentRoom(params.id)

        socket.emit('room_join', {clearId: params.id, username})

    }, [currentRoom, params.id, username, socket])


    // socket handlers
    useEffect(() => {

        if(!socket) return

        // room actions
        socket.on('room_joined', () => {
            console.log('room_joined')
        })

        socket.on('room_not_joined', (reason) => {

            // TODO: handle unauthorized reason

            if(reason === 'username') {
                handleError({err: 'invalidUsername'})
                localStorage.removeItem('tempUsername')
                usernameModal.handleOpenModal()
            }
        })

        socket.on('room_invalid', () => {
            handleError({err: 'invalidRoom'})
            history.push('/')
        })

        socket.on('room_error', () => {
            console.log('room_error')
        })

        // users actions
        socket.on('user_joined', (username) => {
            console.log(`${username} joined the room`)
        })

        // video actions
        socket.on('set video', ({video, username}) => {
            console.log(`received new video from ${username}`)
            setVideo(video)
        })

        return () => {
            socket.off('room_invalid')
            socket.off('room_joined')
            socket.off('room_error')
            socket.off('user_joined')
        }

    }, [socket]) // eslint-disable-line


    const handleSubmit = async e => {
        e.preventDefault()

        if(isURL(search)) {

            try {

                // get video file from url
                const res = await ky.get(`/api/v1/video/extract?url=${encodeURIComponent(search)}`).json()

                // if no url
                if(!res.url) throw Error('no_url')

                let _video = {}

                // video url
                _video.url = Array.isArray(res.url) ? res.url : [res.url]
                // can we use video url or iframe instead
                _video.indirect = res.indirect ? true : false

                if(res.title) _video.title = res.title

                _video.hostname = new URL(_video.url[0]).hostname

                setVideo(_video)

                if(socket) {
                    console.log('sendind video to room')
                    socket.emit('new video', _video)
                }


            } catch(err) {
                console.log(err)
            }

        } else {
            console.log('invalid url')
        }
    }

    return(
        <div className={classnames(style.Watch)}>

            <RoomControls />
            <div ref={playerContainer} className={style.container}>

                {!username &&
                    <ChooseUsername
                        isOpen={usernameModal.isOpen}
                        handleCloseModal={usernameModal.handleCloseModal}
                        cb={(...params) => {console.log(...params)}}
                    />
                }

                <div className={style.playerBox}>
                    <form onSubmit={handleSubmit}>
                        <TextInput
                            width='100%' height='40px'
                            className={style.input}
                            placeholder={l('typeVideoUrl')}

                            value={search}
                            onChange={({target: {value}}) => setSearch(value)}
                        />
                    </form>

                    <Player video={video} playerContainer={playerContainer} socket={socket} />
                </div>

            </div>
            <RoomMembers playerContainer={playerContainer} />
        </div>
    )

}

export default Watch