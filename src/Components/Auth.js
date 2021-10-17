import { useState, useContext, useEffect } from 'react'
import classnames from 'classnames'
import ky from 'ky'

// components
import { Button, TextInput } from 'Components/Inputs'

// context
import AuthContext from 'context/Auth'

// hooks
import useLocalisation from 'utils/hooks/useLocalisation'

// utils
import parseResponseError from 'utils/parseResponseErr'

// style
import style from './styles/Auth.module.scss'

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

const Auth = ({authPopupCallback}) => {

    const l = useLocalisation()

    const [ waiting, setWaiting ] = useState(false)
    const [ register, setRegister ] = useState(false)
    const [ authError, setAuthError ] = useState(null)

    const authContext = useContext(AuthContext)

    useEffect(() => {
        setAuthError(null)
    }, [register])

    const handleSubmit = async e => {
        e.preventDefault()

        const signIn = async () => {
            try {
                const response = await ky.post('/api/v1/auth/login',{
                    json: data
                }).json()


                return response

            } catch(err) {
                return({err: {code: err.response ? err.response.status : 'unknownError'}})
            }
        }

        const signUp = async () => {
            try {

                const response = await ky.post('/api/v1/auth/register', {
                    json: data
                }).json()

                return response

            } catch(err) {
                const { err: errResponse } = await err.response.json()
                return({err: {code: err.response ? err.response.status : 'unknownError', msg: errResponse}})
            }
        }

        const formData = new FormData(e.target)

        const data = {}

        for(const [name, value] of formData.entries()) {
            if(name === 'password' || name === 'email' || name === 'username')
                data[name] = value
        }

        setWaiting(true)

        if(!register) {

            try {
                const res = await signIn()

                setWaiting(false)

                const { err, token } = res

                if(!err && token) {
                    authContext.signIn({token}, authPopupCallback)
                } else {
                    setAuthError({code: err.code, msg: err.msg})
                }

            } catch(err) {
                console.log('dziwny error 1!')
            }
        } else {

            try {

                const { err, token } = await signUp()

                setWaiting(false)

                if(!err) {
                    alert('udalo sie! xd')

                    if(token) {
                        authContext.signIn({token}, authPopupCallback)
                    }

                    // authPopupCallback()
                } else {
                    err.msg = parseResponseError(err.msg)
                    setAuthError(err)
                }

            } catch(err) {
                console.log('dziwny error 2!', err)
            }

        }
    }

    function handleEclipseClick({target}) {
        if(target.classList.contains(style.eclipse))
            authPopupCallback()
    }

    const switchRegister = () => setRegister(!register)
    const height = '40px', width = '100%'

    return(
        <div className={style.eclipse} onClick={handleEclipseClick}>
            <div className={style.Auth} onClick={e => e.stopPropagation()}>

                {

                    !register ?
                        <SignInForm
                            handleSubmit={handleSubmit}
                            height={height} width={width}
                            authError={authError}
                            switchRegister={switchRegister}
                            waiting={waiting}
                            l={l}
                        />
                    :
                        <SignUpForm
                            handleSubmit={handleSubmit}
                            height={height} width={width}
                            authError={authError}
                            switchRegister={switchRegister}
                            waiting={waiting}
                            l={l}
                        />
                }


            </div>

        </div>
    )
}

export default Auth