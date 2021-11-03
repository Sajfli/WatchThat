import { useState, useEffect } from 'react'
import classnames from 'classnames'

// components
import SignUpForm from './SignUpForm'
import SignInForm from './SignInForm'

// hooks
import useLocalisation from 'hooks/useLocalisation'
import useAuth from 'hooks/useAuth'

// style
import style from './Auth.module.scss'


const Auth = ({authPopupCallback}) => {

    const l = useLocalisation()

    const [ waiting, setWaiting ] = useState(false)
    const [ register, setRegister ] = useState(false)
    const [ authError, setAuthError ] = useState(null)

    const auth = useAuth()

    useEffect(() => {
        setAuthError(null)
    }, [register])

    const handleSubmit = async e => {
        e.preventDefault()

        const formData = new FormData(e.target)

        const data = {}

        for(const [name, value] of formData.entries()) {
            if(name === 'password' || name === 'email' || name === 'username')
                data[name] = value
        }

        setWaiting(true)

        if(register) {
            auth.signUp({...data}, authPopupCallback)
        } else {
            auth.signIn({...data}, authPopupCallback)
        }


    }

    const switchRegister = () => setRegister(!register)
    const height = '40px', width = '100%'

    return(
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
    )
}

export default Auth