import classnames from 'classnames'
import Button from '@/components/atoms/Button/Button'

import style from './Buttons.module.scss'

const Buttons = ({ btnProps, btns, className }) => {
    return (
        <div className={classnames(style.buttons, className)}>
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
    btns: PropTypes.array.isRequired,
    className: PropTypes.string,
}

export default Buttons
