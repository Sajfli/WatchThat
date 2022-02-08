import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

import style from './RoomControls.module.scss'
import useToast from 'hooks/useToast'
import useError from 'hooks/useError'

const RoomControls = () => {

    const toast = useToast()
    const handleError = useError()

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
        <div className={style.roomControls}>
            <div className={style.btn} onClick={handleInvite}>
                <FontAwesomeIcon icon={faUserPlus} />
            </div>
        </div>
    )
}

export default RoomControls