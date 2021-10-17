import classnames from 'classnames'
import style from './Button.module.scss'

const Button = ({children, type='button', width='100px', waiting=false}) => {
    return(
        <div
            style={{width}}

            className={classnames(style.Button, waiting ? style.waiting : null)}
        >

            {
                waiting && <div className={style.loading}><div></div></div>
            }

            <button
                type={type}
                className={style.btn}
            >{children}</button>
        </div>
    )
}

export default Button