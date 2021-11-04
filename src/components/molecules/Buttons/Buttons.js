import Button from 'components/atoms/Button/Button'

import style from './Buttons.module.scss'

const Buttons = ({btnProps, btns}) => {

    return(
        <div className={style.buttons}>

            {
                btns && btns.map(({label, ...rest}) =>
                    <Button {...rest} {...btnProps} key={label}>{label}</Button>
                )
            }
        </div>
    )
}

export default Buttons