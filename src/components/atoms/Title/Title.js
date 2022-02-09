import classnames from 'classnames'

import style from './Title.module.scss'

const Title = ({type = 'big', center, children}) => {
    return(
        <div className={classnames(style.title, type && style[type], center ? 'textCenter' : null)}><h1>{children}</h1></div>
    )
}

export default Title