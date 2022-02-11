import { useEffect, useState } from 'react'
import classnames from 'classnames'

import defaultAvatar from 'res/img/default-avatar.jpg'
import style from './Avatar.module.scss'

const Avatar = ({ _id = null, size = 'sm' }) => {
    const [src, setSrc] = useState(defaultAvatar)

    useEffect(() => {
        if (_id) {
            setSrc(defaultAvatar)
            // get avatar from api
        }
    }, [_id])

    return (
        <img
            src={src}
            className={classnames(style.avatar, style[`avatar--${size}`])}
        />
    )
}

Avatar.propTypes = {
    _id: PropTypes.string,
    size: PropTypes.string,
}

export default Avatar
