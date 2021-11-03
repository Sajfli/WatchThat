// components
import TextInput from 'components/atoms/Input/Input'
import Button from 'components/atoms/Button/Button'
import ErrorText from './AuthErrorText'

// style
import style from './Auth.module.scss'

const SignUpForm = ({handleSubmit, height, width, authError, switchRegister, waiting, l}) => {

    return(
        <form onSubmit={handleSubmit} autoComplete='off'>

                    <h1 className={style.title}>
                        {l('signUnTitle')}
                    </h1>

                    <div className={style.textInputs}>

                        <TextInput height={height} width={width} placeholder={l('inputEmail')} name='email' />
                        <ErrorText type='email' authError={authError} />

                        <div className={style.spacer} />

                        <TextInput height={height} width={width} placeholder={l('inputUsername')} name='username' />
                        <ErrorText type='username' authError={authError} />
                        <div className={style.spacer} />

                        <TextInput height={height} width={width}
                            placeholder={l('inputPassword')}
                            type="password"
                            name='password'
                            autoComplete='new-password'
                        />
                        <ErrorText type='password' authError={authError} />

                    </div>

                    <div className={style.bottom}>
                        <Button width={'120px'} type='submit' waiting={waiting}>{l('signUp')}</Button>
                        <div className={style.text} onClick={() => switchRegister()}>
                            {l('existingUser')}
                        </div>
                    </div>
                </form>
    )
}

export default SignUpForm