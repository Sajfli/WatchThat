import { useState, useRef, useEffect, useContext } from 'react'
import ky from 'ky'

import { SocketContext, withSocket } from 'context/RoomSocket'

// utils
import isURL from 'validator/lib/isURL'

// hooks
import useLocalisation from 'hooks/useLocalisation'

// UI components
import Player from 'Components/Player'
import { TextInput } from 'Components/Inputs'

// style
import style from './Watch.module.scss'


const Watch = () => {

    const l = useLocalisation()
    const playerContainer = useRef(null)

    const socket = useContext(SocketContext)
    const [ room, setRoom ] = useState(null)

    // video data
    const [ video, setVideo ] = useState({})

    // text input value
    const [ search, setSearch ] = useState('')

    useEffect(() => {

        console.log('!!! socket effect !!!')

        if(!socket) return

        console.log('!!! przeszło !!!')

        socket.emit('get room id')

        socket.on('room id', roomId => {
            socket.emit('room join', roomId)
        })

        socket.on('room joined', roomId => {
            setRoom(roomId)
            console.log('you have joined the room', roomId)
        })

        socket.on('userConnected', () => {
            console.log('new user connected to the room')
        })

        socket.on('new video', data => {
            // console.log('got new video from socket!', data)
            setVideo(data)
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

                <Player video={video} playerContainer={playerContainer} socket={socket} />
            </div>

        </div>
    )

}

export default withSocket(Watch)