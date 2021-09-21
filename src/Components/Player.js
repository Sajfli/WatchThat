import { useState, useRef } from 'react'
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

import style from './Player.module.scss'

const Player = ({video={}}) => {

    const [ playing, setPlaying ]           = useState(false)
    const [ muted, setMuted ]               = useState(false)
    const [ expanded, setExpanded ]         = useState(false)
    const [ progress, setProgress ]         = useState(0)
    const [ volume, setVolume ]             = useState(50)

    const [ mouseMoving, setMouseMoving ]   = useState(true)

    const handleFullScreen = useFullScreenHandle()

    const playerRef = useRef(null)
    const playCircleRef = useRef(null)
    const timer = useRef(null)

    const handlePlayerClick = ({target}) => {

        const datasetCond = target.dataset.pauseonclick === 'true' || target.parentElement.dataset.pauseonclick === 'true'

        if(target.tagName && (target.tagName === 'VIDEO' || datasetCond)){
            setPlaying(!playing)

            // debugger
            if(playCircleRef.current) {
                playCircleRef.current.style.display = 'block'
                setTimeout(() => {
                    playCircleRef.current.style.display = 'none'
                }, 200)
            }
        }
    }

    const handleSeek = e => {

        if(!playerRef.current) return

        playerRef.current.seekTo(e/100)

    }

    const handleProgress = _progress => {
        // console.log(_progress.played*100)
        setProgress(_progress.played*100)
    }

    const handleMouseMove = () => {

        if(!mouseMoving) setMouseMoving(true)

        clearTimeout(timer.current)
        timer.current = setTimeout(() => setMouseMoving(false), 1500)
    }

    const
        url = video.url || null,
        title = video.title || null

    return(
        <div
            className={style.playerContainer}
            style={expanded ? {
                '--player-width': window.innerWidth + 'px'
            } : null}
        >
            <FullScreen
                handle={handleFullScreen}
            >
                <div
                    className={classnames(style.Player, !mouseMoving && style.mouseNotMoving)}
                    onClick={handlePlayerClick}
                    onMouseMove={handleMouseMove}
                >

                    <ReactPlayer
                        url={url && `/api/v1/video/stream/?url=${url}`}
                        width={'100%'}
                        height={'100%'}

                        playing={playing}
                        volume={muted ? 0 : volume/100}

                        onProgress={handleProgress}
                        ref={playerRef}
                    />

                    { title && <div className={style.title}>{title}</div> }

                    <div className={style.playCircle} ref={playCircleRef}>
                        <FontAwesomeIcon icon={playing ? faPlayCircle : faPauseCircle} />
                    </div>

                    <div className={style.controls}>

                        <div className={style.leftCorner}>
                            <div className={classnames(style.pauseBtn, style.controlComponent, style.btn)} data-pauseonclick='true'>
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

                            <div className={classnames(style.volume, style.controlComponent, style.btn)}>

                                <FontAwesomeIcon

                                    icon={
                                        (muted || volume === 0) ? faVolumeMute
                                        : (volume < 20) ? faVolumeOff
                                        : (volume < 50) ? faVolumeDown
                                        : faVolumeUp
                                    }
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

                </div>
            </FullScreen>
        </div>
    )
}

export default Player