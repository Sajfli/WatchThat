import { useState } from 'react'
import classnames from 'classnames'

import style from './Input.module.scss'

const Input = ({
    width = 160,
    height = 40,
    className,
    inputClassName,
    type = 'text',
    ...rest
}) => {
    const [focused, setFocused] = useState(false)

    return (
        <div
            style={width && height ? { width, height } : {}}
            className={classnames(
                className,
                style.TextInputContainer,
                focused && style.focused
            )}
        >
            {['borderTop', 'borderRight', 'borderBottom', 'borderLeft'].map(
                (border) => (
                    <div
                        key={border}
                        className={classnames(style.border, style[border])}
                    ></div>
                )
            )}

            <input
                {...rest}
                type={type}
                className={classnames(inputClassName, style.TextInput)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
        </div>
    )
}

Input.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    className: PropTypes.string,
    inputClassName: PropTypes.string,

    type: PropTypes.string,
}

export default Input
