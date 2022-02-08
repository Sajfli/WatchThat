import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

import style from './RoomControls.module.scss'
import useToast from 'hooks/useToast'
import useError from 'hooks/useError'

const RoomControls = ({playerContainer}) => {

    const [ minWidth, setMinWidth ] = useState(null)

    const toast = useToast()
    const handleError = useError()

    useEffect(() => {

        if(!playerContainer.current) return

        const updateMinWidth = () => {
            setMinWidth(playerContainer.current.offsetWidth)
        }

        window.addEventListener('resize', updateMinWidth)

        updateMinWidth()

        return () => {
            window.removeEventListener('resize', updateMinWidth)
        }


    }, [playerContainer])

    const handleInvite = () => {

        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                toast('inviteClipboard')
            })
            .catch(() => {
                handleError('inviteClipboardError')
            })
    }

    return(
        <div className={style.roomControls} style={{minWidth}}>
            <div className={style.btn} onClick={handleInvite}>
                <FontAwesomeIcon icon={faUserPlus} />
            </div>
        </div>
    )
}

export default RoomControls