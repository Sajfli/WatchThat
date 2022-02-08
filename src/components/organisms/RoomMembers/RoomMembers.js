import { useEffect, useState } from 'react'
import classnames from 'classnames'

import style from './RoomMembers.module.scss'

const RoomMembers = ({playerContainer, forwardRef, wrapped, members}) => {

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
            ref={forwardRef}
            className={classnames(style.roomMembers, 'roomMembers', wrapped && style.wrapped)}
            style={membersSize && {
                '--height': membersSize.height + 'px',
                '--width': membersSize.width + 'px'
            }}
        >
            {
                members && members.map(({username, socketId}) =>
                    <div key={socketId}>{username}</div>
                )
            }
        </div>
   )
}

export default RoomMembers