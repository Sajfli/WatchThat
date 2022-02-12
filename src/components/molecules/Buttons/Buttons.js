import Button from 'components/atoms/Button/Button'

import style from './Buttons.module.scss'

const Buttons = ({ btnProps, btns }) => {
    return (
        <div className={style.buttons}>
            {btns &&
                btns.map(({ label, ...rest }) => (
                    <Button {...rest} {...btnProps} key={label}>
                        {label}
                    </Button>
                ))}
        </div>
    )
}

Buttons.propTypes = {
    btnProps: PropTypes.any,
    btns: PropTypes.array,
}

export default Buttons
