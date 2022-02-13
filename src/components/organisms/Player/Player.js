import { useState, useRef, useEffect } from 'react'
import classnames from 'classnames'
import ReactPlayer from 'react-player'
import { Range, Direction, getTrackBackground } from 'react-range'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import defUser from 'config/defaultUser'

import useKeyHandle from 'hooks/useKeyHandle'

import {
    faPause,
    faPlay,
    faVolumeUp,
    faVolumeDown,
    faVolumeOff,
    faVolumeMute,
    faExpand,
    faCompress,
    faExpandAlt,
    faCompressAlt,
    faPlayCircle,
    faPauseCircle,
} from '@fortawesome/free-solid-svg-icons'

import style from './Player.module.scss'
import useSocket from 'hooks/useSocket'

const Player = ({ video = {}, containerWidth, cbMoveControls }) => {
    const [playing, setPlaying] = useState(true)
    const [muted, setMuted] = useState(true)
    const [expanded, setExpanded] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(50)
    const [moveControls, setMoveControls] = useState(false)

    const [mouseMoving, setMouseMoving] = useState(true)

    const [receivedTimestamp, setReceivedTimestamp] = useState(null)

    const [socket] = useSocket()

    const handleFullScreen = useFullScreenHandle()

    const playerRef = useRef(null)
    const playCircleRef = useRef(null)

    const timer = useRef(null)

    const handleKey = (e) => {
        const actionKey = defUser.keys

        switch (e.key) {
            case actionKey.pause:
            case actionKey.spacebar:
                if (!playing) handlePlay(true)
                else handlePause(true)

                break

            case actionKey.seek10f:
            case actionKey.seek10b:
            case actionKey.seek5f:
            case actionKey.seek5b:
                // get current time in seconds
                let time = playerRef.current.getCurrentTime() // eslint-disable-line

                // 2nd switch to get specific key
                switch (e.key) {
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

                if (seekTo(time)) {
                    sendChange('seek', time)
                }

                break

            case actionKey.fullScreen:
                if (handleFullScreen.active) handleFullScreen.exit()
                else handleFullScreen.enter()

                break

            default:
                break
        }
    }

    // defKeys is settings' array with keys and actions
    useKeyHandle(Object.values(defUser.keys), handleKey)

    useEffect(() => {
        // SOCKET HANDLER

        if (!socket) return

        // pause and play
        socket.on('playing state', ({ state, username }) => {
            console.log(`${username} ${state ? 'played' : 'paused'} video`)

            setPlaying(state)
        })

        // seek
        socket.on('seek', seekTo)

        // send state to new user
        socket.on('get video state', (target) => {
            if (Object.keys(video).length > 0)
                socket.emit('send video state', {
                    playing,
                    progress: progress / 100,
                    target,
                    timestamp: Date.now(),
                })
        })

        // get video state
        socket.on('set video state', ({ playing, progress, timestamp }) => {
            console.log('received state')
            if (timestamp < receivedTimestamp) return
            setReceivedTimestamp(timestamp)

            seekTo(progress)
            if (playing) handlePlay(false)
            else handlePause(false)
        })

        return () => {
            socket.off('playing state')
            socket.off('seek')
            socket.off('get video state')
        }
    }, [socket, playing, progress, video, receivedTimestamp]) // eslint-disable-line

    useEffect(() => {
        if (!video || !video.hostname) return

        if (/youtu.*be/gi.test(video.hostname)) {
            if (!moveControls) {
                setMoveControls(true)
                cbMoveControls(true)
            }
        } else {
            if (moveControls) {
                setMoveControls(false)
                cbMoveControls(false)
            }
        }
    }, [video])

    const seekTo = (t) => {
        if (!playerRef.current) return false

        playerRef.current.seekTo(t)
        return true
    }

    const handlePlayerClick = ({ target }) => {
        const datasetCond =
            target.dataset.pauseonclick === 'true' ||
            target.parentElement.dataset.pauseonclick === 'true'

        if (target.tagName && (target.tagName === 'VIDEO' || datasetCond)) {
            if (playing) handlePause(true)
            else handlePlay(true)

            if (playCircleRef.current) {
                playCircleRef.current.style.display = 'none'
                playCircleRef.current.style.display = 'block'

                setTimeout(() => {
                    playCircleRef.current.style.display = 'none'
                }, 600)
            }
        }
    }

    const handleSeek = (e) => {
        if (seekTo(e / 100)) {
            sendChange('seek', e / 100)
        }
    }

    const handleProgress = (_progress) => {
        setProgress(_progress.played * 100)
    }

    const handleMouseMove = () => {
        if (!mouseMoving) setMouseMoving(true)

        clearTimeout(timer.current)
        timer.current = setTimeout(() => setMouseMoving(false), 1500)
    }

    const sendChange = (action, value) => {
        switch (action) {
            case 'paused':
            case 'unpaused':
                socket.emit('playing state', action === 'unpaused')

                break
            case 'seek':
                socket.emit('seek', value)
                break
            default:
                break
        }
    }

    const handlePlay = (isLocal) => {
        if (!playing) setPlaying(true)

        if (isLocal) sendChange('unpaused')
    }

    const handlePause = (isLocal) => {
        if (playing) setPlaying(false)

        if (isLocal) sendChange('paused')
    }

    const url = video.url || [],
        title = video.title || null,
        indirect = video.indirect || false

    // if it's a youtube player move contols under youtube iframe

    return (
        <div
            className={classnames(
                style.playerContainer,
                expanded ? style.expanded : null,
                moveControls && style.moveControls,
                handleFullScreen.active && style.fullscreen
            )}
            style={
                containerWidth && typeof containerWidth === 'number'
                    ? { '--max-width': containerWidth + 'px' }
                    : {}
            }
            tabIndex="0"
        >
            <FullScreen handle={handleFullScreen}>
                <div
                    className={classnames(
                        style.Player,
                        !mouseMoving && !moveControls && style.mouseNotMoving
                    )}
                    onClick={handlePlayerClick}
                    onMouseMove={handleMouseMove}
                >
                    <div className={style.ReactPlayer}>
                        {url && url.length > 0 && (
                            <ReactPlayer
                                url={
                                    indirect
                                        ? url[0]
                                        : `/api/v1/video/stream?url=${encodeURIComponent(
                                              url[0]
                                          )}`
                                }
                                width={'100%'}
                                height={'100%'}
                                playing={playing}
                                volume={muted ? 0 : volume / 100}
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
                                            enablejsonapi: 1,
                                        },

                                        onUnstarted: () =>
                                            console.log('failed to autostart'),
                                    },
                                }}
                            />
                        )}
                    </div>

                    {title && !indirect && (
                        <div className={style.title}>{title}</div>
                    )}

                    <div className={style.playCircle} ref={playCircleRef}>
                        <FontAwesomeIcon
                            icon={playing ? faPlayCircle : faPauseCircle}
                        />
                    </div>

                    <div className={style.controls}>
                        <div className={style.leftCorner}>
                            <div
                                className={classnames(
                                    style.controlComponent,
                                    style.btn
                                )}
                                data-pauseonclick="true"
                            >
                                <FontAwesomeIcon
                                    icon={playing ? faPause : faPlay}
                                    data-pauseonclick="true"
                                />
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
                                renderTrack={({ props: _props, children }) => (
                                    <div
                                        style={{
                                            ..._props.style,
                                            height: '10px',
                                            width: '100%',
                                        }}
                                        onMouseDown={_props.onMouseDown}
                                    >
                                        <div
                                            ref={_props.ref}
                                            style={{
                                                width: '100%',
                                                height: '10px',
                                                background: getTrackBackground({
                                                    values: [progress],
                                                    colors: [
                                                        '#e9e9e9',
                                                        '#cccccc46',
                                                    ],
                                                    min: 0,
                                                    max: 100,
                                                }),
                                            }}
                                        >
                                            {children}
                                        </div>
                                    </div>
                                )}
                                renderThumb={({ props: _props }) => (
                                    <div
                                        {..._props}
                                        style={{
                                            ..._props.style,
                                            height: '10px',
                                            width: '10px',
                                        }}
                                    />
                                )}
                            />
                        </div>

                        <div className={style.rightCorner}>
                            <div
                                className={classnames(
                                    style.volume,
                                    style.controlComponent,
                                    style.btn
                                )}
                            >
                                <FontAwesomeIcon
                                    icon={
                                        muted || volume === 0
                                            ? faVolumeMute
                                            : volume < 20
                                            ? faVolumeOff
                                            : volume < 50
                                            ? faVolumeDown
                                            : faVolumeUp
                                    }
                                    style={{ position: 'relative', zIndex: 2 }}
                                    onClick={() => setMuted(!muted)}
                                />

                                <div className={style.volumeBarBox}>
                                    <Range
                                        step={0.1}
                                        min={0}
                                        max={100}
                                        values={[volume]}
                                        onChange={([val]) => {
                                            if (muted) setMuted(false)
                                            setVolume(val)
                                        }}
                                        direction={Direction.Up}
                                        renderTrack={({
                                            props: _props,
                                            children,
                                        }) => (
                                            <div
                                                style={{
                                                    ..._props.style,
                                                    height: '80px',
                                                    width: '3px',
                                                }}
                                                onMouseDown={_props.onMouseDown}
                                            >
                                                <div
                                                    ref={_props.ref}
                                                    style={{
                                                        width: '3px',
                                                        height: '100%',
                                                        background:
                                                            getTrackBackground({
                                                                values: [
                                                                    volume,
                                                                ],
                                                                colors: [
                                                                    '#e9e9e9',
                                                                    '#6e6e6e',
                                                                ],
                                                                min: 0,
                                                                max: 100,
                                                                direction:
                                                                    Direction.Up,
                                                            }),
                                                    }}
                                                >
                                                    {children}
                                                </div>
                                            </div>
                                        )}
                                        renderThumb={({ props: _props }) => (
                                            <div
                                                {..._props}
                                                style={{
                                                    ..._props.style,
                                                    height: '12px',
                                                    width: '12px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#e9e9e9',
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {!handleFullScreen.active && (
                                <div
                                    className={classnames(
                                        style.expand,
                                        style.controlComponent,
                                        style.btn
                                    )}
                                    onClick={() => setExpanded(!expanded)}
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            expanded
                                                ? faCompressAlt
                                                : faExpandAlt
                                        }
                                    />
                                </div>
                            )}

                            <div
                                className={classnames(
                                    style.fullScreen,
                                    style.controlComponent,
                                    style.btn
                                )}
                                onClick={() => {
                                    if (handleFullScreen.active)
                                        handleFullScreen.exit()
                                    else handleFullScreen.enter()
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={
                                        handleFullScreen.active
                                            ? faCompress
                                            : faExpand
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </FullScreen>
        </div>
    )
}

Player.propTypes = {
    video: PropTypes.object,
    containerWidth: PropTypes.number,
    cbMoveControls: PropTypes.func.isRequired,
}

export default Player
