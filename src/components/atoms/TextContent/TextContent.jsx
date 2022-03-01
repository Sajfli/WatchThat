import classnames from 'classnames'
import style from './TextContent.module.scss'

const TextContent = ({center, children, ...rest}) => {
    return(
        <div {...rest} className={classnames(style.textContent, center && style.center)}>
            {children}
        </div>
    )
}

export default TextContent