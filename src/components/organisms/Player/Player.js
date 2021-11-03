import { useState, useRef, useEffect } from 'react'
import classnames from 'classnames'
import ReactPlayer from 'react-player'
import { Range, Direction, getTrackBackground } from 'react-range'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { keys as defKeys } from 'config/defaultUser'

import useKeyHandle from 'hooks/useKeyHandle'


import {
    faPause, faPlay, faVolumeUp, faVolumeDown, faVolumeOff,
    faVolumeMute, faExpand, faCompress, faExpandAlt, faCompressAlt,
    faPlayCircle, faPauseCircle
} from '@fortawesome/free-solid-svg-icons'

import style from './Player.module.scss'
import { socket } from 'context/RoomSocket'

const Player = ({video={}, playerContainer}) => {

    const [ playing, setPlaying ]               = useState(true)
    const [ muted, setMuted ]                   = useState(false)
    const [ expanded, setExpanded ]             = useState(false)
    const [ progress, setProgress ]             = useState(0)
    const [ volume, setVolume ]                 = useState(50)

    const [ mouseMoving, setMouseMoving ]       = useState(true)

    const handleFullScreen = useFullScreenHandle()

    const playerRef = useRef(null)
    const playCircleRef = useRef(null)

    const timer = useRef(null)

    const handleKey = e => {

        const actionKey = defKeys

        switch(e.key) {
            case actionKey.pause: case actionKey.spacebar:

                if(!playing)
                    handlePlay()
                else handlePause()

                break

            case actionKey.seek10f:
            case actionKey.seek10b:
            case actionKey.seek5f:
            case actionKey.seek5b:

                // get current time in seconds
                let
                    time = playerRef.current.getCurrentTime()

                    // 2nd switch to get specific key
                    switch(e.key) {
                        case actionKey.seek10f:
                            time += 10
                            break
                        case actionKey.seek10b:
                            time -= 10
                            break
                        case actionKey.seek5f:
                            time += 5
                            break
                        case actionKey.seek5b:
                            time -= 5
                            break
                        default:
                            break
                    }


                    seekTo(time)

                break;

            case actionKey.fullScreen:
                if(handleFullScreen.active)
                    handleFullScreen.exit()
                else handleFullScreen.enter()

                break

            default:
                break
        }
    }

    // defKeys is settings' array with keys and actions
    useKeyHandle(Object.values(defKeys), handleKey)

    useEffect(() => {

        // SOCKET HANDLER

        // seek
        socket.on('seek', seekTo)

        // pause / unpause
        socket.on('playing', ({playing: p}) => {

            if(p !== playing) {
                setPlaying(p)
            }


        })

        return () => {
            socket.off('seek')
            socket.off('playing')
        }

    }, [playing])

    const seekTo = t => {
        if(!playerRef.current) return false

        playerRef.current.seekTo(t)
        return true
    }

    const handlePlayerClick = ({target}) => {

        const datasetCond = target.dataset.pauseonclick === 'true' || target.parentElement.dataset.pauseonclick === 'true'

        if(target.tagName && (target.tagName === 'VIDEO' || datasetCond)) {

            setPlaying(!playing)

            if(playCircleRef.current) {

                playCircleRef.current.style.display = 'none'
                playCircleRef.current.style.display = 'block'

                setTimeout(() => {
                    playCircleRef.current.style.display = 'none'
                }, 600)

            }
        }
    }

    const handleSeek = e => {

        if(seekTo(e/100)) {
            sendChange('seek', e/100)
        }
    }

    const handleProgress = _progress => {
        setProgress(_progress.played*100)
    }

    const handleMouseMove = () => {

        if(!mouseMoving) setMouseMoving(true)

        clearTimeout(timer.current)
        timer.current = setTimeout(() => setMouseMoving(false), 1500)
    }

    const sendChange = (action, value) => {

        switch(action) {
            case 'paused': case 'unpaused':
                const _playing = action === 'unpaused'

                socket.emit('playing', { playing: _playing, progress })
                break
            case 'seek':
                socket.emit('seek', value)
            break
            default:
                break
        }

    }

    const handlePlay = () => {
        if(!playing) setPlaying(true)
        sendChange('unpaused')
    }

    const handlePause = () => {
        if(playing) setPlaying(false)
        sendChange('paused')
    }

    const
        url = video.url || [],
        title = video.title || null,
        indirect = video.indirect || false

    const containerWidth = playerContainer.current ? playerContainer.current.offsetWidth : null

    // if it's a youtube player move contols under youtube iframe
    const moveControls = /youtu.*be/gi.test(video.hostname)

    return(
        <div
            className={classnames(
                style.playerContainer,
                expanded ? style.expanded : null,
                moveControls && style.moveControls,
                handleFullScreen.active && style.fullscreen
            )}
            style={containerWidth && {'--max-width': containerWidth + 'px'}}

            tabIndex='0'
        >
            <FullScreen
                handle={handleFullScreen}
            >
                <div
                    className={classnames(style.Player, (!mouseMoving && !moveControls) && style.mouseNotMoving)}
                    onClick={handlePlayerClick}
                    onMouseMove={handleMouseMove}
                >

                    <div className={style.ReactPlayer}>
                        {
                            (url && url.length > 0) &&
                            <ReactPlayer
                                url={
                                    indirect
                                    ? url[0]
                                    : `/api/v1/video/stream?url=${encodeURIComponent(url[0])}`
                                }
                                width={'100%'}
                                height={'100%'}

                                playing={playing}
                                volume={muted ? 0 : volume/100}

                                onProgress={handleProgress}
                                ref={playerRef}

                                onPlay={handlePlay}
                                onPause={handlePause}

                                config={{
                                    youtube: {
                                        playerVars: {
                                            autoplay: 1,
                                            controls: 0,
                                            disablekb: 1,
                                            cc_load_policy: 1,
                                            iv_load_policy: 3,
                                            modestbranding: 1,
                                            playsinline: 1,
                                            enablecastapi: 0,
                                            rel: 0,
                                            showinfo: 0,
                                            enablejsonapi: 1
                                        },

                                        onUnstarted: () => console.log('failed to autostart')
                                }
                                }}
                            />
                        }
                    </div>


                    { (title && !indirect) && <div className={style.title}>{title}</div> }

                    <div className={style.playCircle} ref={playCircleRef}>
                        <FontAwesomeIcon icon={playing ? faPlayCircle : faPauseCircle} />
                    </div>


                    <div className={style.controls}>

                        <div className={style.leftCorner}>
                            <div className={classnames(style.controlComponent, style.btn)} data-pauseonclick='true'>
                                <FontAwesomeIcon icon={playing ? faPause : faPlay} data-pauseonclick='true'/>
                            </div>
                        </div>

                        <div className={style.progressBar}>
                            <Range
                                step={0.01}
                                min={0}
                                max={100}
                                values={[progress]}

                                direction={Direction.Right}

                                onChange={handleSeek}

                                renderTrack={({props, children}) => (
                                    <div
                                        style={{
                                            ...props.style,
                                            height: '10px',
                                            width: '100%',
                                        }}
                                        onMouseDown={props.onMouseDown}
                                    >

                                        <div
                                            ref={props.ref}
                                            style={{
                                                width: '100%',
                                                height: '10px',
                                                background: getTrackBackground({
                                                    values: [progress],
                                                    colors: ['#e9e9e9', '#cccccc46'],
                                                    min: 0, max: 100
                                                })
                                            }}
                                        >
                                            {children}
                                        </div>

                                    </div>
                                )}

                                renderThumb={({props}) => (
                                    <div
                                        {...props}
                                        style={{
                                            ...props.style,
                                            height: '10px',
                                            width: '10px',
                                        }}
                                    />
                                )}

                            />
                        </div>

                        <div className={style.rightCorner}>

                            <div
                                className={classnames(style.volume, style.controlComponent, style.btn)}
                            >

                                    <FontAwesomeIcon

                                        icon={
                                            (muted || volume === 0) ? faVolumeMute
                                            : (volume < 20) ? faVolumeOff
                                            : (volume < 50) ? faVolumeDown
                                            : faVolumeUp
                                        }

                                        style={{position: 'relative', zIndex: 2}}

                                        onClick={() => setMuted(!muted)}
                                    />


                                <div className={style.volumeBarBox}>

                                    <Range
                                        step={0.1}
                                        min={0}
                                        max={100}
                                        values={[volume]}
                                        onChange={([val]) => {
                                            if(muted) setMuted(false)
                                            setVolume(val)
                                        }}

                                        direction={Direction.Up}

                                        renderTrack={({props, children}) => (
                                            <div
                                                style={{
                                                    ...props.style,
                                                    height: '80px',
                                                    width: '3px',
                                                }}
                                                onMouseDown={props.onMouseDown}
                                            >
                                                <div
                                                    ref={props.ref}
                                                    style={{
                                                        width: '3px',
                                                        height: '100%',
                                                        background:getTrackBackground({
                                                            values: [volume],
                                                            colors: ['#e9e9e9', '#6e6e6e'],
                                                            min: 0,
                                                            max: 100,
                                                            direction: Direction.Up
                                                        })
                                                    }}
                                                >
                                                    {children}
                                                </div>
                                            </div>
                                        )}

                                        renderThumb={({props}) => (
                                            <div
                                                {...props}
                                                style={{
                                                    ...props.style,
                                                    height: '12px',
                                                    width: '12px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#e9e9e9'
                                                }}
                                            />
                                        )}

                                    />

                                </div>
                            </div>

                            {
                                !handleFullScreen.active &&
                                <div
                                    className={classnames(style.expand, style.controlComponent, style.btn)}
                                    onClick={() => setExpanded(!expanded)}
                                >
                                    <FontAwesomeIcon icon={expanded ? faCompressAlt : faExpandAlt} />
                                </div>
                            }

                            <div
                                className={classnames(style.fullScreen, style.controlComponent, style.btn)}
                                onClick={() => {
                                    if(handleFullScreen.active)
                                        handleFullScreen.exit()
                                    else handleFullScreen.enter()
                                }}
                            >
                                <FontAwesomeIcon icon={handleFullScreen.active ? faCompress : faExpand} />
                            </div>

                        </div>

                    </div>



                </div>
            </FullScreen>
        </div>
    )
}

export default Player