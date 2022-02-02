import classnames from 'classnames'
import useError from 'hooks/useError'

// style
import style from './Auth.module.scss'

const ErrorText = ({mode='signUp', type, authError}) => {

    const handleError = useError()

    if(mode === 'signIn') {
        if(authError)
            return(
                <div className={classnames(style.authError, style[mode])}>
                    Incorrect email or password!
                </div>
            )

        else return null
    } else {
        if(authError && authError.msg && authError.msg[type])
            return(
                <div className={classnames(style.authError, style[mode])}>
                    {
                        mode === 'signIn' ?
                            <>Incorrect email or password!</>
                        :
                            handleError({err: authError.msg[type], useToast: false})
                    }
                </div>
            )
        else return null
    }
}

export default ErrorText