import classnames from 'classnames'

import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import style from './Loading.module.scss'

const Loading = ({ size = 'auto', className, transparent = false }) => {
    return (
        <div
            className={classnames(
                style.loading,
                className,
                transparent && style.transparent
            )}
        >
            <div
                className={classnames(style.spinner, style[`spinner--${size}`])}
            >
                <FontAwesomeIcon className={style.icon} icon={faCircleNotch} />
            </div>
        </div>
    )
}

Loading.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'auto']),
    className: PropTypes.string,
    transparent: PropTypes.bool,
}

export default Loading
