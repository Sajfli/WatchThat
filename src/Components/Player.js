import { useState, useRef, useEffect } from 'react'
import classnames from 'classnames'
import ReactPlayer from 'react-player'
import { Range, Direction, getTrackBackground } from 'react-range'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import {
    faPause, faPlay, faVolumeUp, faVolumeDown, faVolumeOff,
    faVolumeMute, faExpand, faCompress, faExpandAlt, faCompressAlt,
    faPlayCircle, faPauseCircle
} from '@fortawesome/free-solid-svg-icons'

import style from './styles/Player.module.scss'
import { socket } from 'context/RoomSocket'

const isSubArrayEnd = (A, B) => {
    if (A.length < B.length)
      return false;
    let i = 0;
    while (i < B.length) {
      if (A[A.length - i - 1] !== B[B.length - i - 1])
        return false;
      i++;
    }
    return true;
  };

const Player = ({video={}, playerContainer}) => {

    const [ playing, setPlaying ]           = useState(true)
    const [ muted, setMuted ]               = useState(false)
    const [ expanded, setExpanded ]         = useState(false)
    const [ progress, setProgress ]         = useState(0)
    const [ volume, setVolume ]             = useState(50)

    const [ mouseMoving, setMouseMoving ]   = useState(true)

    // only to handle YT seek
    const [ YT_sequence, YT_setSequence ] = useState([]);
    const [ YT_timer, YT_setTimer ] = useState(null);

    const handleFullScreen = useFullScreenHandle()

    const playerRef = useRef(null)
    const playCircleRef = useRef(null)
    const timer = useRef(null)

    const YT_handleStateChange = e => YT_handleEvent(e.data)
    const YT_handleSeek = () => console.log("Seek!!!!!!!!!!!");

    const YT_handleEvent = type => {
        // Update sequence with current state change event
        console.log('array', YT_sequence)

        YT_setSequence([...YT_sequence, type]);

        if (type === 1 && isSubArrayEnd(YT_sequence, [3]) && !YT_sequence.includes(-1)) {
          YT_handleSeek(); // Arrow keys seek
          YT_setSequence([]); // Reset event sequence
        } else {
          clearTimeout(YT_timer); // Cancel previous event
          if (type !== 3) { // If we're not buffering,
            let timeout = setTimeout(function () { // Start timer
                //   if (type === 1) console.log('play', type)
                //   else if (type === 2) console.log('pause', type)
                YT_setSequence([]); // Reset event sequence
            }, 250);
            YT_setTimer(timeout);
          }
        }
      };

    useEffect(() => {
        if(!playerRef.current) return

        const internalPlayer = playerRef.current.getInternalPlayer()
        // console.log(internalPlayer)
        if(!internalPlayer) return

        // internalPlayer.onStateChange = YT_handleStateChange
        // internalPlayer.onPlayerStateChange = console.log
        internalPlayer.addEventListener('onStateChange', YT_handleStateChange)

        // internalPlayer.onStateChange = YT_handleStateChange

        return () => {
            internalPlayer.removeEventListener('onStateChange', YT_handleStateChange)
        }

    }, [playerRef, YT_handleStateChange])

    useEffect(() => {
        // seek
        socket.on('seek', seekTo)

        // pause / unpause
        socket.on('playing', ({playing: p, progress}) => {

            if(p !== playing) {
                setPlaying(p)
                // seekTo(progress/100)
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

            // if(playing)
            //     sendChange('paused')
            // else sendChange('unpaused')

            // if(socket)
                // socket.emit('playing', {playing: !playing, progress})

            setPlaying(!playing)

            if(playCircleRef.current) {
                playCircleRef.current.style.display = 'block'
                setTimeout(() => {
                    playCircleRef.current.style.display = 'none'
                }, 200)
            }
        }
    }

    const handleSeek = e => {

        alert('seek')

        if(seekTo(e/100)) {
            sendChange('seek', e/100)
        }
            // if(socket)
            //     socket.emit('seek', e/100)
    }

    const handleProgress = _progress => {
        setProgress(_progress.played*100)

        // sendChange('progress', _progress)
    }

    const handleMouseMove = () => {

        if(!mouseMoving) setMouseMoving(true)

        clearTimeout(timer.current)
        timer.current = setTimeout(() => setMouseMoving(false), 1500)
    }

    const sendChange = (action, value) => {
        // console.log(action, value)
        // console.log(action, value)

        switch(action) {
            case 'paused': case 'unpaused':
                const _playing = action === 'unpaused'
                // if(_playing === playing)
                //     break
                socket.emit('playing', { playing: _playing, progress })
                break
            case 'seek':
                socket.emit('seek', value)
            break
            default:
                break
        }

    }

    const
        url = video.url || [],
        title = video.title || null,
        indirect = video.indirect || false

    const containerWidth = playerContainer.current ? playerContainer.current.offsetWidth : null

    return(
        <div
            className={classnames(style.playerContainer, expanded ? style.expanded : null)}
            style={containerWidth && {'--max-width': containerWidth + 'px'}}
        >
            <FullScreen
                handle={handleFullScreen}
            >
                <div
                    className={classnames(style.Player, !mouseMoving && style.mouseNotMoving)}
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

                                onPlay={() => sendChange('unpaused')}
                                onPause={() => sendChange('paused')}

                                config={{
                                    youtube: {
                                        playerVars: {
                                            controls: 1
                                        },
                                        onUnstarted: () => console.log('failed to autostart')
                                }
                                }}
                            />
                        }
                    </div>


                    { title && <div className={style.title}>{title}</div> }

                    <div className={style.playCircle} ref={playCircleRef}>
                        <FontAwesomeIcon icon={playing ? faPlayCircle : faPauseCircle} />
                    </div>

                    {
                        !indirect && (
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

                            <div
                                className={classnames(style.expand, style.controlComponent, style.btn)}
                                onClick={() => setExpanded(!expanded)}
                            >
                                <FontAwesomeIcon icon={expanded ? faCompressAlt : faExpandAlt} />
                            </div>

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
                        )
                    }



                </div>
            </FullScreen>
        </div>
    )
}

export default Player