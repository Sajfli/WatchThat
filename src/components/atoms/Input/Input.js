 import { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import style from './Input.module.scss'

const Input = ({width = 160, height = 40, className, inputClassName, type = 'text', ...rest}) => {

    const [ focused, setFocused ] = useState(false)

    return(
        <div
            style={{width, height}}
            className={classnames(className, style.TextInputContainer, focused && style.focused)}
        >

            {
                ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'].map(border =>(
                    <div key={border} className={classnames(style.border, style[border])}></div>
                ))
            }

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
    width: PropTypes.string,
    height: PropTypes.string,

    className: PropTypes.string,
    inputClassName: PropTypes.string,

    type: PropTypes.string
}

export default Input