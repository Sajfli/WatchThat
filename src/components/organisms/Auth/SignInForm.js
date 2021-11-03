// components
import TextInput from 'components/atoms/Input/Input'
import Button from 'components/atoms/Button/Button'
import ErrorText from './AuthErrorText'

// style
import style from './Auth.module.scss'

const SignInForm = ({handleSubmit, height, width, authError, switchRegister, waiting, l}) => {

    return(
        <form onSubmit={handleSubmit}>

                    <h1 className={style.title}>
                        {l('signInTitle')}
                    </h1>

                    <div className={style.textInputs}>

                        <TextInput height={height} width={width} placeholder={l('inputEmail')} name='email' />
                        <div className={style.spacer} />

                        <TextInput height={height} width={width} placeholder={l('inputPassword')} type="password" name='password' />
                        <div className={style.text}>{l('forgottenPassword')}</div>

                    </div>

                    <ErrorText mode='signIn' authError={authError} />

                    <div className={style.bottom}>
                        <Button type='submit' waiting={waiting}>{l('signIn')}</Button>
                        <div className={style.text} onClick={() => switchRegister()}>
                            { l('newUser') }
                        </div>
                    </div>
                </form>
    )
}

export default SignInForm