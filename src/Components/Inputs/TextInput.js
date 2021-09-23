import { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import style from './TextInput.module.scss'

const TextInput = ({width, height, className, inputClassName, ...rest}) => {

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
                type='text'
                className={classnames(inputClassName, style.TextInput)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
        </div>
    )
}

TextInput.propTypes = {
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,

    className: PropTypes.string,
    inputClassName: PropTypes.string
}

export default TextInput