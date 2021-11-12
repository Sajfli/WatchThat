import { useState, useRef, useEffect, useContext } from 'react'
import ky from 'ky'
import URL from 'url-parse'

import { SocketContext, withSocket } from 'context/RoomSocket'

// utils
import isURL from 'validator/lib/isURL'

// hooks
import useLocalisation from 'hooks/useLocalisation'

// UI components
import Player from 'components/organisms/Player/Player'
import TextInput from 'components/atoms/Input/Input'

// style
import style from './Watch.module.scss'
import { useHistory, useParams } from 'react-router'


const Watch = () => {

    const l = useLocalisation()
    const playerContainer = useRef(null)

    const history = useHistory()
    const params = useParams()
    const socket = useContext(SocketContext)
    // const [ room, setRoom ] = useState(null)

    // video data
    const [ video, setVideo ] = useState({})

    // text input value
    const [ search, setSearch ] = useState('')

    const playerRef = useRef({})

    useEffect(() => {

        if(!socket || !params.id) {
            return history.push('/')
        }

        socket.emit('room join', params.id)

        // handle room joined event
        socket.on('room joined', ({roomId, video}) => {
            if(video) {
                setVideo(video)
                socket.emit('get watchtime')
            }
            console.log('you have joined the room', roomId)
        })

        // when a new user connect to the room
        socket.on('userConnected', () => {
            console.log('new user connected to the room')
        })

        // handle new video from other user in room
        socket.on('new video', data => {
            setVideo(data)
        })

        socket.on('get watchtime', () => {
            // socket.emit('send watchtime', {video, })
            if(playerRef.current) {

                const { playing, progress } = playerRef.current

                socket.emit('send watchtime', {video, state: {
                    playing, progress
                }})
            }

        })

        return () => socket.disconnect()
    }, [socket])

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
                    console.log('sending video to room')
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
        <div ref={playerContainer} className={style.container}>

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

                <Player video={video} playerContainer={playerContainer} socket={socket} ref={playerRef} />
            </div>

        </div>
    )

}

export default withSocket(Watch)