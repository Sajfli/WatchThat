import { useEffect, useState } from 'react'

import Avatar from 'components/atoms/Avatar/Avatar'
import RoomChat from 'components/organisms/RoomChat/RoomChat'

import style from './RoomSidebar.module.scss'

const RoomSidebar = ({
    playerContainer,
    forwardRef,
    members,
    moveControls,
    username,
}) => {
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

        const observer = new ResizeObserver(updateWidth).observe(
            playerContainer.current
        )

        return () => observer.disconnect()
    }, [playerContainer])

    return (
        <div
            ref={forwardRef}
            className={style.roomSidebar}
            style={
                membersSize && {
                    '--height':
                        (moveControls
                            ? membersSize.height + 60
                            : membersSize.height) + 'px',
                    '--width': membersSize.width + 'px',
                }
            }
        >
            <div className={style.members}>
                {members &&
                    members.map(({ username, socketId, _id, self }) => (
                        <div
                            key={socketId}
                            className={classnames(
                                style.user,
                                self && style.self
                            )}
                            title={username}
                        >
                            <Avatar _id={_id} size="full" />
                            {/* <span className={style.username}>{username}</span> */}
                        </div>
                    ))}
            </div>
            {username && <RoomChat username={username} />}
        </div>
    )
}

RoomSidebar.propTypes = {
    playerContainer: PropTypes.any,
    forwardRef: PropTypes.any,
    wrapped: PropTypes.bool,
    members: PropTypes.array,
    moveControls: PropTypes.bool,
    username: PropTypes.string,
}

export default RoomSidebar
