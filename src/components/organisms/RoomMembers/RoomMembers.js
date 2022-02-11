import { useEffect, useState } from 'react'

import Avatar from 'components/atoms/Avatar/Avatar'

import style from './RoomMembers.module.scss'

const RoomMembers = ({ playerContainer, forwardRef, wrapped, members }) => {
    const [membersSize, setMembersSize] = useState(null)

    // container width
    useEffect(() => {
        const updateWidth = () => {
            if (!playerContainer.current) return

            setMembersSize({
                width: playerContainer.current.offsetWidth,
                height: playerContainer.current.offsetHeight,
            })
        }

        setTimeout(() => {
            updateWidth()
        }, 1)

        window.addEventListener('resize', updateWidth)

        return () => window.removeEventListener('resize', updateWidth)
    }, [playerContainer])

    return (
        <div
            ref={forwardRef}
            className={classnames(
                style.roomMembers,
                'roomMembers',
                wrapped && style.wrapped
            )}
            style={
                membersSize && {
                    '--height': membersSize.height + 'px',
                    '--width': membersSize.width + 'px',
                }
            }
        >
            {members &&
                members.map(({ username, socketId, _id, self }) => (
                    <div
                        key={socketId}
                        className={classnames(style.user, self && style.self)}
                    >
                        <Avatar _id={_id} size="xs" />
                        <span className={style.username}>{username}</span>
                    </div>
                ))}
        </div>
    )
}

RoomMembers.propTypes = {
    playerContainer: PropTypes.any,
    forwardRef: PropTypes.any,
    wrapped: PropTypes.bool,
    members: PropTypes.array,
}

export default RoomMembers
