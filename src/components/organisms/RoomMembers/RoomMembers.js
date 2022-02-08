import { useEffect, useState } from 'react'
import classnames from 'classnames'

import style from './RoomMembers.module.scss'

const RoomMembers = ({playerContainer}) => {

    const [ membersSize, setMembersSize ] = useState(null)

    // container width
    useEffect(() => {
        const updateWidth = () => {
            if(!playerContainer.current) return

            setMembersSize({
                width: playerContainer.current.offsetWidth,
                height: playerContainer.current.offsetHeight
            })

        }

        updateWidth()

        window.addEventListener('resize', updateWidth)

        return () => window.removeEventListener('resize', updateWidth)

    }, [playerContainer])

   return(
        <div
            className={classnames(style.roomMembers, 'roomMembers')}
            style={membersSize && {
                '--height': membersSize.height + 'px',
                '--width': membersSize.width + 'px'
            }}
        >a</div>
   )
}

export default RoomMembers