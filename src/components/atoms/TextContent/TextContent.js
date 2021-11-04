import classnames from 'classnames'
import style from './TextContent.module.scss'

const TextContent = ({center, children}) => {
    return(
        <div className={classnames(style.textContent, center && style.center)}>
            {children}
        </div>
    )
}

export default TextContent