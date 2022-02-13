import { useEffect, useState, Suspense } from 'react'

import Avatar from 'components/atoms/Avatar/Avatar'
const RoomChat = React.lazy(() =>
    import('components/organisms/RoomChat/RoomChat')
)

import style from './RoomSidebar.module.scss'
import Loading from 'components/molecules/Loading/Loading'

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

        return () => {
            if (observer) observer.disconnect()
        }
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
                        </div>
                    ))}
            </div>
            {username && (
                <Suspense
                    fallback={
                        <Loading
                            className={style.chatLoading}
                            size="md"
                            transparent
                        />
                    }
                >
                    <RoomChat username={username} />
                </Suspense>
            )}
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
