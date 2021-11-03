import classnames from 'classnames'

// style
import style from './Auth.module.scss'

const ErrorText = ({mode='signUp', type, authError}) => {

    if(mode === 'signIn') {
        if(authError)
            return(
                <div className={classnames(style.authError, style[mode])}>
                    Incorrect email or password!
                </div>
            )

        else return null
    } else {
        if(authError && authError.msg)
            return(
                <div className={classnames(style.authError, style[mode])}>
                    {
                        mode === 'signIn' ?
                            <>Incorrect email or password!</>
                        :
                            authError.msg[type]
                    }
                </div>
            )
        else return null
    }
}

export default ErrorText