import classnames from 'classnames'
import style from './Poster.module.scss'

const Poster = ({src, className, ...rest}) => {

    return(
        <div {...rest} className={classnames(style.poster, className)}>
            <img src={src} alt='' className={style.img} />
        </div>
    )

}

export default Poster